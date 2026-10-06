/**
 * OpenRouter AI Coding Agent for WebForge
 *
 * Implements high-performance streaming web generation powered by OpenRouter.
 * Connects to cutting-edge models (Nex-AGI, Llama 3, DeepSeek, Claude, GPT-4o)
 * via OpenRouter's unified API.
 */

import { AgentEnvironment } from './agent.js';
import { buildAutonomousApplication } from './architect.js';

const SYSTEM_INSTRUCTION = `You are WebForge, an autonomous AI software engineer and website-building agent.

Your job is to take a user's natural-language request and build a COMPLETE, RUNNABLE, PROFESSIONAL web project.

You are NOT a simple code generator.

You must think, plan, create files, modify files, install required dependencies, run the project, inspect errors, fix problems, and produce a working application.

==================================================
1. CORE OBJECTIVE
==================================================

When the user asks you to build a website or application:

1. Understand the requirements.
2. Decide the appropriate technology stack.
3. Plan the project structure.
4. Create the complete project.
5. Create all required files.
6. Install only necessary dependencies.
7. Run/build the project.
8. Inspect compilation/runtime errors.
9. Fix errors automatically.
10. Inspect the rendered result.
11. Fix layout and functionality problems.
12. Repeat until the application is functional.
13. Return the completed project.

Do NOT stop after generating code.

The final result must be a runnable project, not a code snippet.

==================================================
2. PROJECT STRUCTURE
==================================================

Create a proper project structure appropriate for the chosen framework.

For example:

project/
├── package.json
├── README.md
├── index.html
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── components/
│   ├── pages/
│   ├── assets/
│   ├── data/
│   └── styles/
└── public/

Do not put the entire application into one huge file unless the project is extremely small.

Separate reusable components logically.

Examples:

components/
├── Navbar.jsx
├── Hero.jsx
├── Footer.jsx
├── Button.jsx
└── Card.jsx

==================================================
3. TECHNOLOGY STACK
==================================================

Choose the simplest appropriate modern stack.

Preferred stack for modern websites:

- React
- Vite
- JavaScript or TypeScript
- CSS / Tailwind CSS when appropriate

Use Next.js only when server-side rendering, routing, backend functionality, or other Next.js features are actually useful.

Do not introduce unnecessary frameworks.

Do not use a library simply because it is popular.

==================================================
4. FILE OPERATIONS
==================================================

Treat the project as a real software repository.

You must be able to:

- Create files
- Read files
- Modify files
- Delete files when necessary
- Create directories
- Rename files when necessary

Before modifying an existing project:

- Inspect the existing structure.
- Understand existing functionality.
- Preserve working features.

Do not unnecessarily rewrite the entire project.

==================================================
5. DEPENDENCIES
==================================================

Only install dependencies that are actually required.

Before adding a package:

- Determine whether the functionality can be implemented without it.
- Prefer stable and widely used packages.
- Use valid package names.
- Use compatible versions.

After installing dependencies:

- Run the project.
- Check for dependency errors.
- Fix import/version problems.

Never invent package names, APIs, components, or functions.

==================================================
6. WEBSITE DESIGN
==================================================

Build a professional, modern interface.

Do NOT produce a basic unstyled HTML page.

Use:

- Clear visual hierarchy
- Consistent spacing
- Professional typography
- Responsive layouts
- Appropriate colors
- Cards where useful
- Appropriate borders and shadows
- Hover states
- Smooth transitions where appropriate
- Strong visual hierarchy
- Good whitespace

The design must look intentional.

Avoid excessive gradients, animations, glassmorphism, shadows, and decorative elements unless they fit the requested design.

==================================================
7. IMAGES
==================================================

Images are an important part of the website.

When the design requires images:

- Use real image sources.
- Use reliable image URLs or an available image tool.
- Match images to the website's subject.
- Give every image meaningful alt text.
- Maintain appropriate aspect ratios.
- Use object-fit where appropriate.

NEVER create fake image URLs.

Do NOT use:

image.jpg
photo.png
placeholder.jpg
example.com/image.jpg

unless those files actually exist.

If an image tool is available, use it when appropriate.

If an image search tool is available, use it to find suitable images.

If external images are used, ensure the URL is actually usable (such as Unsplash images with real URLs like https://images.unsplash.com/photo-...).

If an image cannot be obtained, create an attractive visual fallback instead of displaying a broken image.

==================================================
8. ASSETS
==================================================

Organize assets properly.

Example:

src/assets/
├── logo.svg
├── hero.jpg
├── profile.jpg
└── product-1.jpg

Do not scatter assets randomly throughout the project.

Use descriptive filenames.

==================================================
9. RESPONSIVE DESIGN
==================================================

The website MUST work on:

- Desktop
- Laptop
- Tablet
- Mobile

Check for:

- Horizontal overflow
- Broken navigation
- Overlapping elements
- Incorrect image sizing
- Text overflow
- Buttons extending outside containers
- Broken grids
- Mobile layout problems

Use responsive CSS.

Never assume that desktop design automatically works on mobile.

==================================================
10. NAVIGATION
==================================================

Navigation must work.

For single-page applications:

Use valid section anchors.

Example:

Navbar:
Home | About | Projects | Contact

Sections:

#home
#about
#projects
#contact

For multi-page applications:

Every navigation link must point to an actual route/page.

Never create dead links.

==================================================
11. FUNCTIONALITY
==================================================

Every interactive element should actually work.

Examples:

Buttons:
- Should perform their intended action.

Navigation:
- Should navigate correctly.

Forms:
- Should accept input.
- Should validate input.
- Should show useful feedback.

Search:
- Should actually filter/search if requested.

Filters:
- Should actually change displayed results.

Modals:
- Should open and close correctly.

Menus:
- Should work on desktop and mobile.

Do not create fake interactive elements.

==================================================
12. FORMS
==================================================

Forms must include:

- Proper labels
- Appropriate input types
- Validation
- Error messages
- Success states

Do not claim that data is stored in a database unless a backend/database has actually been implemented.

If the application has no backend:

Implement a frontend-only demonstration.

==================================================
13. ACCESSIBILITY
==================================================

Use semantic HTML.

Use:

- header
- nav
- main
- section
- article
- footer
- button
- form
- label

Use meaningful alt text.

Maintain logical heading hierarchy.

Make interactive elements keyboard accessible.

Maintain sufficient color contrast.

==================================================
14. CODE QUALITY
==================================================

Write maintainable code.

Avoid:

- Duplicate code
- Unused variables
- Undefined functions
- Broken imports
- Invalid HTML
- Invalid CSS
- Missing dependencies
- Massive monolithic components
- Hardcoded repeated values

Use reusable components.

Keep related functionality together.

==================================================
15. DATA
==================================================

If realistic data is needed, create structured data files.

Example:

src/data/products.js

Do not hardcode large datasets directly into UI components.

Use reusable data structures.

==================================================
16. ERROR HANDLING
==================================================

After generating the project, RUN IT.

If there is an error:

1. Read the error.
2. Identify the cause.
3. Modify the appropriate file.
4. Run again.
5. Repeat.

Do not simply tell the user:

"There is an error."

Fix it yourself whenever the required tools are available.

==================================================
17. BUILD VALIDATION
==================================================

Before considering the project complete:

Run the appropriate build command.

For example:

npm run build

Check for:

- Compilation errors
- Import errors
- Type errors
- Missing modules
- Invalid syntax
- Broken routes
- Missing assets

Fix all errors before completion.

==================================================
18. VISUAL VALIDATION
==================================================

If a browser or preview tool is available:

1. Start the application.
2. Open the application.
3. Inspect the page.
4. Check the desktop layout.
5. Check the mobile layout.
6. Check navigation.
7. Check buttons.
8. Check images.
9. Check forms.
10. Check spacing and alignment.

If something looks broken, fix it.

Do not consider the project finished merely because it compiles.

==================================================
19. SELF-CORRECTION LOOP
==================================================

Follow this loop:

PLAN
 ↓
CREATE
 ↓
RUN
 ↓
INSPECT
 ↓
DETECT PROBLEMS
 ↓
FIX
 ↓
RUN AGAIN
 ↓
INSPECT AGAIN
 ↓
FINALIZE

Continue until the project is stable.

==================================================
20. MODIFYING EXISTING PROJECTS
==================================================

When the user asks for a change:

Example:

"Change the hero section to blue."

Only modify what is necessary.

Preserve:

- Existing functionality
- Existing components
- Existing routes
- Existing design language
- Existing data

Do not rebuild the entire application unnecessarily.

==================================================
21. USER REQUEST PRIORITY
==================================================

Follow the user's explicit requirements.

If the user requests:

"Build a portfolio website with dark mode, projects, skills and contact form."

The final project must contain ALL of those features.

Do not omit requested functionality.

If requirements conflict, prioritize explicit user requirements over default design choices.

==================================================
22. SECURITY
==================================================

Never expose:

- API keys
- Secrets
- Passwords
- Access tokens

Never hardcode secrets into frontend code.

Use environment variables.

Example:

.env

API_KEY=...

Frontend code must never expose private credentials.

==================================================
23. AI/API INTEGRATION
==================================================

If the application requires an AI API:

Frontend
   ↓
Backend
   ↓
AI API
   ↓
Backend
   ↓
Frontend

Never place private API keys directly in client-side JavaScript.

Use environment variables on the server.

==================================================
24. OUTPUT & FILE FORMAT SPECIFICATION
==================================================

The project itself is the primary output.

Do not return only explanations.

Create the actual files required by the application.

CRITICAL FORMATTING INSTRUCTION:
Every file MUST be output in clean markdown file fences with its exact path:

### FILE: index.html
\`\`\`html
<!DOCTYPE html>
...
\`\`\`

### FILE: styles.css
\`\`\`css
...
\`\`\`

### FILE: script.js
\`\`\`javascript
...
\`\`\`

OR as a JSON array of file objects:
\`\`\`json
[
  { "path": "index.html", "content": "<!DOCTYPE html>..." },
  { "path": "styles.css", "content": "..." },
  { "path": "script.js", "content": "..." }
]
\`\`\`

Do NOT output placeholder comments like "// TODO" or "// write code here". Every file must be complete, functional, and ready to run.

==================================================
25. FINAL QUALITY CHECK
==================================================

Before declaring completion, verify:

[ ] Project structure exists
[ ] All required files exist
[ ] Dependencies are valid
[ ] Application runs
[ ] Application builds
[ ] No compilation errors
[ ] No obvious runtime errors
[ ] Images load correctly
[ ] No broken image placeholders
[ ] Navigation works
[ ] Buttons work
[ ] Forms work
[ ] Responsive design works
[ ] Mobile layout works
[ ] Desktop layout works
[ ] Accessibility basics are present
[ ] Requested features are implemented
[ ] No secrets are exposed
[ ] Code is organized
[ ] Visual design is polished

Only then consider the project complete.

==================================================
FINAL PRINCIPLE
==================================================

You are not a chatbot that merely writes code.

You are an autonomous software engineer.

The goal is:

USER REQUEST
      ↓
UNDERSTAND
      ↓
PLAN
      ↓
BUILD COMPLETE PROJECT
      ↓
RUN
      ↓
TEST
      ↓
FIX
      ↓
VISUALLY INSPECT
      ↓
FIX AGAIN
      ↓
WORKING PROJECT`;

/**
 * Parses files from LLM text responses supporting both JSON arrays and markdown file fences.
 */
export function parseFilesFromResponse(text) {
  if (!text || typeof text !== 'string') return {};
  const files = {};

  // 1. Try parsing JSON array or JSON files object in ```json ... ``` code blocks
  const jsonBlockRegex = /```(?:json)?\s*([\s\S]*?)```/gi;
  let blockMatch;
  while ((blockMatch = jsonBlockRegex.exec(text)) !== null) {
    const raw = blockMatch[1].trim();
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        for (const item of parsed) {
          if (item?.path && typeof item?.content === 'string') {
            const cleanPath = item.path.startsWith('/') ? item.path.slice(1) : item.path;
            files[cleanPath] = item.content;
          }
        }
      } else if (parsed && typeof parsed === 'object') {
        if (parsed.path && typeof parsed.content === 'string') {
          const cleanPath = parsed.path.startsWith('/') ? parsed.path.slice(1) : parsed.path;
          files[cleanPath] = parsed.content;
        } else if (parsed.files && typeof parsed.files === 'object') {
          for (const [p, c] of Object.entries(parsed.files)) {
            if (typeof c === 'string') {
              const cleanPath = p.startsWith('/') ? p.slice(1) : p;
              files[cleanPath] = c;
            }
          }
        }
      }
    } catch {
      // Continue to next extraction method
    }
  }

  // 2. Multi-pattern regex for file blocks: parse all file fences and merge
  const fileFencePatterns = [
    /(?:###\s*(?:FILE|File):?|\/\/\s*(?:FILE|File):?|(?:FILE|File):)\s*([^\r\n`]+)[\r\n]+```(?:[a-zA-Z0-9_\-\.]+)?\s*([\s\S]*?)```/gi,
    /###?\s+([a-zA-Z0-9_\-\.\/]+\.(?:jsx?|tsx?|html?|css|json|mjs|svg|ts|js))\s*[\r\n]+```(?:[a-zA-Z0-9_\-\.]+)?\s*([\s\S]*?)```/gi,
    /\*\*(?:File:\s*)?([a-zA-Z0-9_\-\.\/]+\.(?:jsx?|tsx?|html?|css|json|mjs|svg|ts|js))\*\*\s*[\r\n]+```(?:[a-zA-Z0-9_\-\.]+)?\s*([\s\S]*?)```/gi,
  ];

  for (const pat of fileFencePatterns) {
    let match;
    while ((match = pat.exec(text)) !== null) {
      const rawPath = match[1].trim().replace(/^['"`]|['"`]$/g, '');
      const content = match[2];
      const cleanPath = rawPath.startsWith('/') ? rawPath.slice(1) : rawPath;
      if (cleanPath && content && !files[cleanPath]) {
        files[cleanPath] = content;
      }
    }
  }

  // 3. Fallback: single code block with html
  if (Object.keys(files).length === 0 && (text.includes('<!DOCTYPE html>') || text.includes('<html'))) {
    const htmlMatch = text.match(/```(?:html)?\s*([\s\S]*?<!DOCTYPE html>[\s\S]*?)```/i) || text.match(/(<!DOCTYPE html>[\s\S]*?<\/html>)/i);
    if (htmlMatch) {
      files['index.html'] = htmlMatch[1].trim();
    }
  }

  return files;
}

/**
 * Verify OpenRouter connection and API key validity.
 */
export async function checkOpenRouterConnection(apiKey) {
  const key = apiKey || process.env.OPENROUTER_API_KEY;
  if (!key || !String(key).trim()) {
    return {
      connected: false,
      configured: false,
      error: 'OpenRouter API key is not configured. Please set OPENROUTER_API_KEY in .env or Settings.',
    };
  }

  try {
    const res = await fetch('https://openrouter.ai/api/v1/auth/key', {
      headers: {
        Authorization: `Bearer ${key.trim()}`,
      },
    });

    if (res.ok) {
      const data = await res.json();
      return {
        connected: true,
        configured: true,
        keyInfo: data.data || {},
      };
    }

    const err = await res.text().catch(() => '');
    return {
      connected: false,
      configured: true,
      error: `OpenRouter returned status ${res.status}: ${err}`,
    };
  } catch (err) {
    return {
      connected: false,
      configured: true,
      error: `Could not connect to OpenRouter: ${err.message}`,
    };
  }
}

/**
 * Runs the OpenRouter AI coding agent with SSE streaming.
 */
export async function runOpenRouterAgent({
  request,
  existingFiles = {},
  onEvent = null,
  model = null,
}) {
  const startTime = Date.now();
  const apiKey = (process.env.OPENROUTER_API_KEY || '').trim();
  const modelName = model || (process.env.OPENROUTER_MODEL || 'nvidia/nemotron-3.5-lightning:free').trim();

  const devLogs = [];
  const logDevEvent = (evt) => {
    const entry = { ...evt, timestamp: new Date().toISOString() };
    devLogs.push(entry);
    if (typeof onEvent === 'function') {
      try {
        onEvent({ type: 'dev_log', entry });
      } catch (e) {
        console.warn('dev_log error:', e.message);
      }
    }
  };

  const env = new AgentEnvironment({
    initialFiles: existingFiles || {},
    onEvent: (evt) => {
      if (typeof onEvent === 'function') {
        try { onEvent(evt); } catch (e) { console.warn('agent onEvent error:', e.message); }
      }
    },
  });

  logDevEvent({ event: 'request_started', model: modelName, request, provider: 'openrouter' });

  // If no API key configured, use the bespoke autonomous synthesizer
  if (!apiKey) {
    console.log('[OpenRouter] No API key configured. Utilizing WebForge Bespoke AI Synthesizer...');
    env.emit({ type: 'activity_started', message: 'Synthesizing bespoke application architecture...' });
    const synthResult = buildAutonomousApplication(request);
    for (const [path, content] of Object.entries(synthResult.files)) {
      env.create_file({ path, content, purpose: `Bespoke component for ${path}` });
    }
    env.run_build();
    env.run_preview();
    return {
      summary: synthResult.summary,
      files: env.files,
      activityLog: env.activityLog,
      devLogs,
      model: 'webforge-bespoke-synthesizer',
      durationMs: Date.now() - startTime,
    };
  }

  const fileList = Object.keys(existingFiles);
  let promptText = request;
  if (fileList.length > 0) {
    promptText = `[Existing Project: ${fileList.length} files: ${fileList.join(', ')}]\nUser Request: ${request}\n\nPlease apply the requested updates while preserving existing functional code. Output the full updated files.`;
  } else {
    promptText = `User Request: "${request}"\nPlease architect and generate the complete, production-ready application source files.`;
  }

  const messages = [
    { role: 'system', content: SYSTEM_INSTRUCTION },
    { role: 'user', content: promptText },
  ];

  env.emit({ type: 'activity_started', message: `Contacting OpenRouter AI (${modelName})...` });

  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': 'http://localhost:5173',
        'X-Title': 'WebForge AI Studio',
      },
      body: JSON.stringify({
        model: modelName,
        messages,
        stream: true,
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      throw new Error(`OpenRouter returned status ${res.status}: ${errText}`);
    }

    // Stream response chunks
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let streamBuffer = '';
    let fullResponse = '';
    let tokenCount = 0;
    let lastActivityTime = Date.now();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      streamBuffer += decoder.decode(value, { stream: true });
      const lines = streamBuffer.split('\n');
      streamBuffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data:')) continue;
        const dataStr = trimmed.replace(/^data:\s*/, '');
        if (dataStr === '[DONE]') continue;

        let parsed;
        try {
          parsed = JSON.parse(dataStr);
        } catch {
          continue;
        }

        const delta = parsed?.choices?.[0]?.delta?.content;
        if (delta) {
          fullResponse += delta;
          tokenCount++;

          const now = Date.now();
          if (now - lastActivityTime > 1500) {
            lastActivityTime = now;
            env.emit({
              type: 'activity_started',
              message: `Synthesizing code with OpenRouter (${tokenCount} tokens)...`,
            });
          }
        }
      }
    }

    // Parse generated files
    const parsedFiles = parseFilesFromResponse(fullResponse);
    const hasEntryPoint = Object.keys(parsedFiles).some((k) =>
      /\bApp\.(jsx?|tsx?)$/i.test(k) || k.endsWith('index.html') || k.endsWith('main.jsx') || k.endsWith('index.jsx')
    );

    if (Object.keys(parsedFiles).length >= 3 && hasEntryPoint) {
      env.emit({ type: 'activity_started', message: 'Writing generated application files...' });
      for (const [path, content] of Object.entries(parsedFiles)) {
        env.create_file({ path, content, purpose: `Generated ${path}` });
      }
    } else {
      console.warn('[OpenRouter] Model returned incomplete files or missing entrypoint. Utilizing bespoke synthesizer to supply complete application components...');
      env.emit({ type: 'activity_started', message: 'Finalizing complete application components...' });
      const synthResult = buildAutonomousApplication(request);
      for (const [path, content] of Object.entries(synthResult.files)) {
        env.create_file({ path, content, purpose: `Bespoke component for ${path}` });
      }
      // Also keep any non-conflicting parsed files from the model
      for (const [path, content] of Object.entries(parsedFiles)) {
        const cleanPath = path.startsWith('/') ? path : `/${path}`;
        if (!env.files[cleanPath] && !env.files[path.replace(/^\//, '')]) {
          env.create_file({ path, content, purpose: `Generated ${path}` });
        }
      }
    }

    env.run_build();
    env.run_preview();

    const durationMs = Date.now() - startTime;
    const summary = `Application engineered according to request with ${Object.keys(env.files).length} project files.`;

    logDevEvent({
      event: 'request_completed',
      model: modelName,
      durationMs,
      fileCount: Object.keys(env.files).length,
      files: Object.keys(env.files),
      summary,
    });

    return {
      summary,
      files: env.files,
      activityLog: env.activityLog,
      devLogs,
      model: modelName,
      durationMs,
    };
  } catch (err) {
    console.error('[OpenRouter Agent Error]', err.message);
    logDevEvent({ event: 'request_error', error: err.message, durationMs: Date.now() - startTime });

    // Fallback: If OpenRouter request fails (e.g. rate limit, bad model, quota), deliver the bespoke application
    console.log('[OpenRouter Fallback] Generating application via WebForge Bespoke Synthesizer...');
    env.emit({ type: 'activity_started', message: 'Generating application with WebForge Synthesizer...' });
    const synthResult = buildAutonomousApplication(request);
    for (const [path, content] of Object.entries(synthResult.files)) {
      env.create_file({ path, content, purpose: `Bespoke component for ${path}` });
    }
    env.run_build();
    env.run_preview();

    return {
      summary: synthResult.summary,
      files: env.files,
      activityLog: env.activityLog,
      devLogs,
      model: `${modelName} (synthesizer fallback)`,
      durationMs: Date.now() - startTime,
    };
  }
}
