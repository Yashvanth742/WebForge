import { createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'node:http';
import { buildWebsite } from './agent.js';
import { runGeminiAgent } from './geminiAgent.js';

const scrypt = promisify(scryptCallback);
const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_FILE = join(__dirname, '../data/store.json');
const PORT = Number(process.env.PORT || 4000);
const IS_PROD = process.env.NODE_ENV === 'production';

// Secure JWT Secret Setup
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET || JWT_SECRET.length < 32) {
  console.warn('[Security] Warning: Set a 32+ character JWT_SECRET in server/.env for production.');
}
const SECRET = JWT_SECRET || 'development-only-secret-change-me-before-deployment';

// In-memory rate limiting tracker
const limiters = new Map();

// Helper: Base64 URL encoding
function base64url(value) {
  return Buffer.from(value).toString('base64url');
}

// Token signing & verification using HMAC-SHA256
function signToken(payload) {
  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = base64url(JSON.stringify(payload));
  const signature = createHmac('sha256', SECRET).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${signature}`;
}

function verifyToken(token) {
  const [header, body, signature] = (token || '').split('.');
  if (!header || !body || !signature) return null;

  const expected = createHmac('sha256', SECRET).update(`${header}.${body}`).digest('base64url');
  if (signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url'));
    return payload.exp > Date.now() / 1000 ? payload : null;
  } catch {
    return null;
  }
}

// Cookie parser & serializer
function parseCookies(req) {
  return Object.fromEntries(
    (req.headers.cookie || '')
      .split(';')
      .map((v) => v.trim().split('=').map(decodeURIComponent))
      .filter(([k]) => k)
  );
}

function serializeCookie(name, value, opts = {}) {
  const flags = [`${name}=${encodeURIComponent(value)}`, 'Path=/', 'SameSite=Lax'];
  if (opts.httpOnly) flags.push('HttpOnly');
  if (IS_PROD) flags.push('Secure');
  if (opts.maxAge) flags.push(`Max-Age=${opts.maxAge}`);
  return flags.join('; ');
}

// Persistent JSON Store
async function loadDatabase() {
  try {
    return JSON.parse(await readFile(DATA_FILE, 'utf8'));
  } catch {
    return { users: [], projects: [], sessions: [] };
  }
}

async function saveDatabase(db) {
  await mkdir(dirname(DATA_FILE), { recursive: true });
  const temp = `${DATA_FILE}.${randomBytes(4).toString('hex')}`;
  await writeFile(temp, JSON.stringify(db, null, 2), { mode: 0o600 });
  await rename(temp, DATA_FILE);
}

// Password hashing and validation
async function hashPassword(password) {
  const salt = randomBytes(16);
  const hash = await scrypt(password, salt, 64);
  return `${salt.toString('hex')}:${Buffer.from(hash).toString('hex')}`;
}

async function verifyPassword(password, stored) {
  if (!stored || typeof stored !== 'string' || !stored.includes(':')) return false;
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  try {
    const candidate = Buffer.from(await scrypt(password, Buffer.from(salt, 'hex'), 64));
    const actual = Buffer.from(hash, 'hex');
    return candidate.length === actual.length && timingSafeEqual(candidate, actual);
  } catch {
    return false;
  }
}

function generateId(prefix) {
  return `${prefix}_${randomBytes(12).toString('hex')}`;
}

function publicUser(user) {
  return {
    _id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar || user.picture || null,
    provider: user.provider || 'local',
  };
}

function jsonResponse(res, status, body, headers = {}) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'X-Content-Type-Options': 'nosniff',
    'Cache-Control': 'no-store',
    ...headers,
  });
  res.end(JSON.stringify(body));
}

function checkRateLimit(key, maxRequests, windowMs) {
  const now = Date.now();
  const record = limiters.get(key) || { count: 0, reset: now + windowMs };
  if (record.reset < now) {
    record.count = 0;
    record.reset = now + windowMs;
  }
  record.count++;
  limiters.set(key, record);
  return record.count <= maxRequests;
}

async function readRequestBody(req) {
  let raw = '';
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > 200_000) throw new Error('Payload too large');
  }
  try {
    return raw ? JSON.parse(raw) : {};
  } catch {
    throw new Error('Invalid JSON payload');
  }
}

function checkCsrf(req) {
  const cookies = parseCookies(req);
  const token = req.headers['x-csrf-token'];
  return Boolean(cookies.csrf && token === cookies.csrf);
}

function authenticateUser(req, db) {
  const token = parseCookies(req).access_token;
  const payload = verifyToken(token);
  if (!payload) return null;

  const user = db.users.find((u) => u.id === payload.sub);
  const session = db.sessions.some(
    (s) => s.id === payload.jti && s.userId === payload.sub && s.expiresAt > Date.now()
  );

  return user && session ? payload : null;
}

function sanitizePrompt(value) {
  return String(value || '')
    .trim()
    .replace(/[<>]/g, '')
    .slice(0, 4000);
}

function projectSummary(p) {
  return {
    _id: p.id,
    name: p.name,
    description: p.description,
    version: p.version,
    published: p.published,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}

function projectPayload(p) {
  return {
    ...projectSummary(p),
    messages: p.messages || [],
    files: p.files || {},
  };
}

async function createSession(res, db, user, securityHeaders) {
  const csrf = randomBytes(24).toString('base64url');
  const sessionId = generateId('ses');
  const expiresAt = Date.now() + 24 * 60 * 60_000; // 24 hours

  // Prune expired sessions
  db.sessions = db.sessions.filter((s) => s.expiresAt > Date.now() && s.userId !== user.id);
  db.sessions.push({ id: sessionId, userId: user.id, expiresAt });

  const token = signToken({
    sub: user.id,
    jti: sessionId,
    exp: Math.floor(expiresAt / 1000),
  });

  await saveDatabase(db);

  jsonResponse(
    res,
    200,
    { user: publicUser(user), csrfToken: csrf },
    {
      ...securityHeaders,
      'Set-Cookie': [
        serializeCookie('access_token', token, { httpOnly: true, maxAge: 24 * 60 * 60 }),
        serializeCookie('csrf', csrf, { maxAge: 24 * 60 * 60 }),
      ],
    }
  );
}

// Request Handler
const requestHandler = async (req, res) => {
  const origin = req.headers.origin;

  // Robust CORS parsing: handles comma-separated lists and cleans quotes
  const rawOrigins = process.env.ORIGINS || process.env.CLIENT_ORIGIN || 'http://localhost:5173';
  const allowedOrigins = rawOrigins
    .split(',')
    .map((val) => val.trim().replace(/^["']|["']$/g, ''))
    .filter(Boolean);

  const isOriginAllowed = !origin || allowedOrigins.includes(origin) || origin === 'null';
  const corsOrigin = origin && allowedOrigins.includes(origin) ? origin : allowedOrigins[0] || '*';

  const securityHeaders = {
    'Access-Control-Allow-Origin': corsOrigin,
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers': 'Content-Type, X-CSRF-Token',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'X-Content-Type-Options': 'nosniff',
  };

  // Handle pre-flight CORS
  if (req.method === 'OPTIONS') {
    res.writeHead(204, securityHeaders);
    return res.end();
  }

  const clientIp = req.socket.remoteAddress || 'unknown';
  if (!checkRateLimit(`${clientIp}:${req.url}`, 300, 60_000)) {
    return jsonResponse(res, 429, { error: 'Too many requests. Please slow down.' }, securityHeaders);
  }

  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const path = url.pathname;
    const db = await loadDatabase();

    // 1. Health check
    if (req.method === 'GET' && path === '/api/health') {
      return jsonResponse(res, 200, { ok: true, timestamp: new Date().toISOString() }, securityHeaders);
    }

    // 2. Auth: Register
    if (req.method === 'POST' && path === '/api/auth/register') {
      const { name, email, password } = await readRequestBody(req);
      const cleanEmail = String(email || '').trim().toLowerCase();

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
        return jsonResponse(res, 400, { error: 'Please provide a valid email address.' }, securityHeaders);
      }
      if (String(name || '').trim().length < 2) {
        return jsonResponse(res, 400, { error: 'Name must be at least 2 characters.' }, securityHeaders);
      }
      if (String(password || '').length < 4) {
        return jsonResponse(res, 400, { error: 'Password must be at least 4 characters.' }, securityHeaders);
      }

      if (db.users.some((u) => u.email === cleanEmail)) {
        return jsonResponse(res, 409, { error: 'An account already exists for this email.' }, securityHeaders);
      }

      const user = {
        id: generateId('usr'),
        name: String(name).trim().slice(0, 100),
        email: cleanEmail,
        passwordHash: await hashPassword(password),
        createdAt: new Date().toISOString(),
      };

      db.users.push(user);
      await saveDatabase(db);
      return createSession(res, db, user, securityHeaders);
    }

    // 3. Auth: Login
    if (req.method === 'POST' && path === '/api/auth/login') {
      const { email, password } = await readRequestBody(req);
      const cleanEmail = String(email || '').trim().toLowerCase();
      const user = db.users.find((u) => u.email === cleanEmail);

      if (user && !user.passwordHash && user.provider === 'google') {
        return jsonResponse(
          res,
          400,
          { error: 'This account was registered using Google. Please click "Continue with Google" to sign in.' },
          securityHeaders
        );
      }

      if (!user || !(await verifyPassword(String(password || ''), user.passwordHash))) {
        return jsonResponse(res, 401, { error: 'Invalid email or password. You can create a new account or use Quick Demo Sign In.' }, securityHeaders);
      }

      return createSession(res, db, user, securityHeaders);
    }

    // 3b. Auth: Quick Demo Sign In
    if (req.method === 'POST' && path === '/api/auth/demo') {
      const demoEmail = 'developer@webforge.ai';
      let user = db.users.find((u) => u.email === demoEmail);

      if (!user) {
        user = {
          id: generateId('usr'),
          name: 'Alex Developer',
          email: demoEmail,
          passwordHash: await hashPassword('demo1234'),
          createdAt: new Date().toISOString(),
        };
        db.users.push(user);
        await saveDatabase(db);
      }

      return createSession(res, db, user, securityHeaders);
    }

    // 3c. Auth: Google Sign-In & Register
    if (req.method === 'POST' && path === '/api/auth/google') {
      const body = await readRequestBody(req);
      let email = '';
      let name = '';
      let avatar = '';
      let googleId = '';

      // Support Google Identity Services JWT token
      if (body.credential) {
        try {
          const parts = body.credential.split('.');
          if (parts.length >= 2) {
            const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
            email = String(payload.email || '').trim().toLowerCase();
            name = String(payload.name || payload.given_name || email.split('@')[0]).trim();
            avatar = payload.picture || '';
            googleId = payload.sub || '';
          }
        } catch (err) {
          console.error('[Google Auth] Error decoding credential token:', err);
        }
      }

      // Also support direct profile payload
      if (!email && body.email) {
        email = String(body.email).trim().toLowerCase();
        name = String(body.name || email.split('@')[0]).trim();
        avatar = body.avatar || body.picture || '';
        googleId = body.googleId || body.sub || '';
      }

      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return jsonResponse(res, 400, { error: 'Please provide a valid Google account email.' }, securityHeaders);
      }

      let user = db.users.find((u) => u.email === email);
      if (!user) {
        // Register new user via Google
        user = {
          id: generateId('usr'),
          name: name || 'Google User',
          email,
          avatar: avatar || null,
          googleId: googleId || null,
          provider: 'google',
          createdAt: new Date().toISOString(),
        };
        db.users.push(user);
        await saveDatabase(db);
      } else {
        // Update user if avatar or googleId was missing
        let changed = false;
        if (!user.avatar && avatar) {
          user.avatar = avatar;
          changed = true;
        }
        if (!user.googleId && googleId) {
          user.googleId = googleId;
          changed = true;
        }
        if (changed) {
          await saveDatabase(db);
        }
      }

      return createSession(res, db, user, securityHeaders);
    }

    // 3d. Auth: Reset / Update Password
    if (req.method === 'POST' && path === '/api/auth/reset-password') {
      const { email, newPassword } = await readRequestBody(req);
      const cleanEmail = String(email || '').trim().toLowerCase();
      const user = db.users.find((u) => u.email === cleanEmail);

      if (!user) {
        return jsonResponse(res, 404, { error: 'No account found with this email address.' }, securityHeaders);
      }

      if (user.provider === 'google' && !user.passwordHash) {
        return jsonResponse(
          res,
          400,
          { error: 'This account signs in with Google. Use "Continue with Google" instead.' },
          securityHeaders
        );
      }

      if (String(newPassword || '').length < 4) {
        return jsonResponse(res, 400, { error: 'New password must be at least 4 characters.' }, securityHeaders);
      }

      user.passwordHash = await hashPassword(newPassword);
      user.updatedAt = new Date().toISOString();
      await saveDatabase(db);

      return jsonResponse(
        res,
        200,
        { ok: true, message: 'Password updated successfully! You can now sign in.' },
        securityHeaders
      );
    }

    // 4. Auth: Me
    const session = authenticateUser(req, db);
    if (req.method === 'GET' && path === '/api/auth/me') {
      if (!session) return jsonResponse(res, 401, { error: 'Unauthorized' }, securityHeaders);
      const user = db.users.find((u) => u.id === session.sub);
      return jsonResponse(res, 200, { user: publicUser(user) }, securityHeaders);
    }

    // 5. Auth: Logout
    if (req.method === 'POST' && path === '/api/auth/logout') {
      if (session) {
        db.sessions = db.sessions.filter((s) => s.id !== session.jti);
        await saveDatabase(db);
      }
      res.writeHead(204, {
        ...securityHeaders,
        'Set-Cookie': [
          serializeCookie('access_token', '', { httpOnly: true, maxAge: 0 }),
          serializeCookie('csrf', '', { maxAge: 0 }),
        ],
      });
      return res.end();
    }

    // 6. Public Preview (accessible without login if published)
    const publicMatch = path.match(/^\/api\/projects\/public\/([a-z0-9_]+)$/i);
    if (req.method === 'GET' && publicMatch) {
      const projId = publicMatch[1];
      const project = db.projects.find((p) => p.id === projId && p.published);
      if (!project) {
        return jsonResponse(res, 404, { error: 'Website is not published yet or not found.' }, securityHeaders);
      }
      return jsonResponse(res, 200, projectPayload(project), securityHeaders);
    }

    // 7. Agent Status and Configuration (No session required so user can check status and configure in dev)
    if (req.method === 'GET' && path === '/api/agent/status') {
      return jsonResponse(
        res,
        200,
        {
          configured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim()),
          model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
        },
        securityHeaders
      );
    }

    if (req.method === 'POST' && path === '/api/agent/config') {
      const { apiKey, model } = await readRequestBody(req);
      if (apiKey !== undefined) {
        process.env.GEMINI_API_KEY = String(apiKey).trim();
      }
      if (model) {
        process.env.GEMINI_MODEL = String(model).trim();
      }
      try {
        const envPath = join(__dirname, '../.env');
        let envContent = await readFile(envPath, 'utf8');
        if (envContent.includes('GEMINI_API_KEY=')) {
          envContent = envContent.replace(
            /GEMINI_API_KEY=".*?"|GEMINI_API_KEY=.*$/m,
            `GEMINI_API_KEY="${process.env.GEMINI_API_KEY}"`
          );
        } else {
          envContent += `\nGEMINI_API_KEY="${process.env.GEMINI_API_KEY}"`;
        }
        if (model) {
          if (envContent.includes('GEMINI_MODEL=')) {
            envContent = envContent.replace(
              /GEMINI_MODEL=".*?"|GEMINI_MODEL=.*$/m,
              `GEMINI_MODEL="${process.env.GEMINI_MODEL}"`
            );
          } else {
            envContent += `\nGEMINI_MODEL="${process.env.GEMINI_MODEL}"`;
          }
        }
        await writeFile(envPath, envContent, 'utf8');
      } catch (err) {
        console.warn('[Server] Could not persist to .env:', err.message);
      }
      return jsonResponse(
        res,
        200,
        {
          configured: Boolean(process.env.GEMINI_API_KEY),
          model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
        },
        securityHeaders
      );
    }

    // From here, require authenticated user
    if (!session) {
      return jsonResponse(res, 401, { error: 'Unauthorized. Please sign in.' }, securityHeaders);
    }
    const userId = session.sub;

    // 8. Projects: List all for current user
    if (req.method === 'GET' && path === '/api/projects') {
      const userProjects = db.projects
        .filter((p) => p.ownerId === userId)
        .map(projectSummary);
      return jsonResponse(res, 200, userProjects, securityHeaders);
    }

    // 9. Projects: Create new project via Gemini Agent
    if (req.method === 'POST' && path === '/api/projects') {
      const { prompt } = await readRequestBody(req);
      const cleanPrompt = sanitizePrompt(prompt);

      if (cleanPrompt.length < 3) {
        return jsonResponse(res, 400, { error: 'Please enter a description for your website.' }, securityHeaders);
      }

      console.log(`[Server] Generating website for prompt via Gemini Agent: "${cleanPrompt}"`);
      const isStream = url.searchParams.get('stream') === 'true' || req.headers.accept?.includes('text/event-stream');

      if (isStream) {
        res.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache, no-transform',
          'Connection': 'keep-alive',
          ...securityHeaders,
        });

        const sendEvent = (evt) => {
          res.write(`data: ${JSON.stringify(evt)}\n\n`);
        };

        try {
          const agentResult = await runGeminiAgent({
            request: cleanPrompt,
            onEvent: sendEvent,
          });

          const now = new Date().toISOString();
          const projectName = cleanPrompt.length > 35 ? `${cleanPrompt.slice(0, 32)}...` : cleanPrompt;

          const project = {
            id: generateId('prj'),
            ownerId: userId,
            name: projectName,
            description: cleanPrompt,
            version: 1,
            published: false,
            createdAt: now,
            updatedAt: now,
            messages: [
              { role: 'user', content: cleanPrompt, timestamp: now },
              {
                role: 'assistant',
                content: agentResult.summary,
                timestamp: new Date().toISOString(),
                activityEvents: agentResult.activityLog || [],
                devLogs: agentResult.devLogs || [],
              },
            ],
            files: agentResult.files,
          };

          db.projects.unshift(project);
          await saveDatabase(db);

          sendEvent({ type: 'done', project: projectPayload(project) });
          return res.end();
        } catch (error) {
          console.error('[Server Error in Gemini generation]', error.message);
          sendEvent({
            type: 'error',
            error: error.message || 'Gemini Agent failed to generate website.',
          });
          return res.end();
        }
      }

      // Non-streaming fallback
      try {
        const agentResult = await runGeminiAgent({ request: cleanPrompt });
        const now = new Date().toISOString();
        const projectName = cleanPrompt.length > 35 ? `${cleanPrompt.slice(0, 32)}...` : cleanPrompt;

        const project = {
          id: generateId('prj'),
          ownerId: userId,
          name: projectName,
          description: cleanPrompt,
          version: 1,
          published: false,
          createdAt: now,
          updatedAt: now,
          messages: [
            { role: 'user', content: cleanPrompt, timestamp: now },
            {
              role: 'assistant',
              content: agentResult.summary,
              timestamp: new Date().toISOString(),
              activityEvents: agentResult.activityLog || [],
              devLogs: agentResult.devLogs || [],
            },
          ],
          files: agentResult.files,
        };

        db.projects.unshift(project);
        await saveDatabase(db);
        return jsonResponse(res, 201, projectPayload(project), securityHeaders);
      } catch (error) {
        console.error('[Server Error in Gemini generation]', error.message);
        return jsonResponse(res, 500, { error: error.message }, securityHeaders);
      }
    }

    // 10. Project actions: /api/projects/:id/...
    const projectMatch = path.match(/^\/api\/projects\/([a-z0-9_]+)(?:\/(chat|files|publish))?$/i);
    if (!projectMatch) {
      return jsonResponse(res, 404, { error: 'Route not found' }, securityHeaders);
    }

    const [, projectId, action] = projectMatch;
    const project = db.projects.find((p) => p.id === projectId && p.ownerId === userId);
    if (!project) {
      return jsonResponse(res, 404, { error: 'Project not found' }, securityHeaders);
    }

    // Get single project
    if (req.method === 'GET' && !action) {
      return jsonResponse(res, 200, projectPayload(project), securityHeaders);
    }

    // Delete project
    if (req.method === 'DELETE' && !action) {
      db.projects = db.projects.filter((p) => p.id !== projectId);
      await saveDatabase(db);
      return jsonResponse(res, 204, {}, securityHeaders);
    }

    // Publish project
    if (req.method === 'POST' && action === 'publish') {
      project.published = true;
      project.updatedAt = new Date().toISOString();
      await saveDatabase(db);
      return jsonResponse(res, 200, { published: true, url: `/preview/${project.id}` }, securityHeaders);
    }

    // Update files directly (from Code Editor)
    if (req.method === 'PUT' && action === 'files') {
      const { files } = await readRequestBody(req);
      if (!files || typeof files !== 'object') {
        return jsonResponse(res, 400, { error: 'Invalid files payload' }, securityHeaders);
      }
      project.files = files;
      project.version = (project.version || 1) + 1;
      project.updatedAt = new Date().toISOString();
      await saveDatabase(db);
      return jsonResponse(res, 200, projectPayload(project), securityHeaders);
    }

    // Iterative Chat: update website via Gemini Agent conversation
    if (req.method === 'POST' && action === 'chat') {
      const { prompt } = await readRequestBody(req);
      const cleanPrompt = sanitizePrompt(prompt);

      if (cleanPrompt.length < 2) {
        return jsonResponse(res, 400, { error: 'Please enter a change request.' }, securityHeaders);
      }

      console.log(`[Server] Updating project ${projectId} via Gemini Agent with prompt: "${cleanPrompt}"`);
      const isStream = url.searchParams.get('stream') === 'true' || req.headers.accept?.includes('text/event-stream');

      if (isStream) {
        res.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache, no-transform',
          'Connection': 'keep-alive',
          ...securityHeaders,
        });

        const sendEvent = (evt) => {
          res.write(`data: ${JSON.stringify(evt)}\n\n`);
        };

        try {
          const agentResult = await runGeminiAgent({
            request: cleanPrompt,
            existingFiles: project.files,
            previousMessages: project.messages || [],
            onEvent: sendEvent,
          });

          project.files = {
            ...project.files,
            ...agentResult.files,
          };
          project.version = (project.version || 1) + 1;
          project.updatedAt = new Date().toISOString();
          project.messages = project.messages || [];
          project.messages.push(
            { role: 'user', content: cleanPrompt, timestamp: new Date().toISOString() },
            {
              role: 'assistant',
              content: agentResult.summary,
              timestamp: new Date().toISOString(),
              activityEvents: agentResult.activityLog || [],
              devLogs: agentResult.devLogs || [],
            }
          );

          await saveDatabase(db);
          sendEvent({ type: 'done', project: projectPayload(project) });
          return res.end();
        } catch (error) {
          console.error('[Server Error in Gemini revision]', error.message);
          sendEvent({
            type: 'error',
            error: error.message || 'Gemini Agent failed to update website.',
          });
          return res.end();
        }
      }

      // Non-streaming fallback
      try {
        const agentResult = await runGeminiAgent({
          request: cleanPrompt,
          existingFiles: project.files,
          previousMessages: project.messages || [],
        });

        project.files = {
          ...project.files,
          ...agentResult.files,
        };
        project.version = (project.version || 1) + 1;
        project.updatedAt = new Date().toISOString();
        project.messages = project.messages || [];
        project.messages.push(
          { role: 'user', content: cleanPrompt, timestamp: new Date().toISOString() },
          {
            role: 'assistant',
            content: agentResult.summary,
            timestamp: new Date().toISOString(),
            activityEvents: agentResult.activityLog || [],
            devLogs: agentResult.devLogs || [],
          }
        );

        await saveDatabase(db);
        return jsonResponse(res, 200, projectPayload(project), securityHeaders);
      } catch (error) {
        console.error('[Server Error in Gemini revision]', error.message);
        return jsonResponse(res, 500, { error: error.message }, securityHeaders);
      }
    }

    return jsonResponse(res, 405, { error: 'Method not allowed' }, securityHeaders);
  } catch (error) {
    console.error('[Server Error]', error);
    return jsonResponse(
      res,
      error.message === 'Payload too large' ? 413 : 500,
      { error: error.message || 'Internal server error' },
      securityHeaders
    );
  }
};

// Start Server
const serverInstance = createServer(requestHandler);
serverInstance.listen(PORT, () => {
  console.log(`[WebForge Server] Ready at http://localhost:${PORT}`);
});
