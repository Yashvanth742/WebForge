/**
 * Official Google Gemini Coding Agent for WebForge
 *
 * Implements a real, iterative tool-calling agent loop powered by Google Gemini.
 * Gemini receives the user's prompt, decides which project tools to call,
 * the backend executes those tools on the real project workspace, and returns
 * the tool results to Gemini until the build is verified and the task is complete.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { AgentEnvironment } from './agent.js';

// Gemini Tool Function Declarations
export const GEMINI_TOOL_DECLARATIONS = [
  {
    name: 'inspect_project',
    description: 'Inspect the current project structure, existing files, directories, framework, and dependencies.',
    parameters: {
      type: 'OBJECT',
      properties: {},
    },
  },
  {
    name: 'list_files',
    description: 'List all files in the project workspace or within a specific directory.',
    parameters: {
      type: 'OBJECT',
      properties: {
        directory: {
          type: 'STRING',
          description: 'Optional subfolder path to filter, or empty to list all files',
        },
      },
    },
  },
  {
    name: 'read_file',
    description: 'Read the contents of an existing file in the project workspace.',
    parameters: {
      type: 'OBJECT',
      properties: {
        path: {
          type: 'STRING',
          description: 'Path of the file to read, e.g. "src/App.jsx" or "package.json"',
        },
      },
      required: ['path'],
    },
  },
  {
    name: 'create_directory',
    description: 'Create a new directory in the project.',
    parameters: {
      type: 'OBJECT',
      properties: {
        path: {
          type: 'STRING',
          description: 'Directory path to create, e.g. "src/components"',
        },
      },
      required: ['path'],
    },
  },
  {
    name: 'create_file',
    description: 'Create a new file in the project workspace with complete, functional source code.',
    parameters: {
      type: 'OBJECT',
      properties: {
        path: {
          type: 'STRING',
          description: 'File path, e.g. "src/components/ProductCard.jsx" or "index.html"',
        },
        content: {
          type: 'STRING',
          description: 'The complete source code or text content of the file',
        },
      },
      required: ['path', 'content'],
    },
  },
  {
    name: 'update_file',
    description: 'Update or modify the complete content of an existing file in the project.',
    parameters: {
      type: 'OBJECT',
      properties: {
        path: {
          type: 'STRING',
          description: 'File path to update, e.g. "src/styles.css"',
        },
        content: {
          type: 'STRING',
          description: 'The updated complete source code for the file',
        },
      },
      required: ['path', 'content'],
    },
  },
  {
    name: 'delete_file',
    description: 'Delete a file from the project workspace.',
    parameters: {
      type: 'OBJECT',
      properties: {
        path: {
          type: 'STRING',
          description: 'File path to delete',
        },
      },
      required: ['path'],
    },
  },
  {
    name: 'rename_file',
    description: 'Rename or move a file in the project workspace.',
    parameters: {
      type: 'OBJECT',
      properties: {
        old_path: { type: 'STRING', description: 'Existing file path' },
        new_path: { type: 'STRING', description: 'New file path' },
      },
      required: ['old_path', 'new_path'],
    },
  },
  {
    name: 'install_dependency',
    description: 'Install or declare an npm package dependency into package.json.',
    parameters: {
      type: 'OBJECT',
      properties: {
        package_name: {
          type: 'STRING',
          description: 'Name of the npm package, e.g. "lucide-react"',
        },
        version: {
          type: 'STRING',
          description: 'Package version, e.g. "^1.0.0" or "latest"',
        },
      },
      required: ['package_name'],
    },
  },
  {
    name: 'run_build',
    description: 'Run project build validation to check for syntax errors, unclosed brackets, and broken imports.',
    parameters: {
      type: 'OBJECT',
      properties: {},
    },
  },
  {
    name: 'get_build_errors',
    description: 'Retrieve error messages from the last failed build attempt.',
    parameters: {
      type: 'OBJECT',
      properties: {},
    },
  },
  {
    name: 'run_preview',
    description: 'Verify project entry points and compile the live preview.',
    parameters: {
      type: 'OBJECT',
      properties: {},
    },
  },
  {
    name: 'refresh_preview',
    description: 'Trigger a live reload of the running preview iframe.',
    parameters: {
      type: 'OBJECT',
      properties: {},
    },
  },
  {
    name: 'complete_task',
    description: 'Call when you have finished all required file operations, build verification, and the application is ready.',
    parameters: {
      type: 'OBJECT',
      properties: {
        summary: {
          type: 'STRING',
          description: 'A concise explanation of what you built or modified.',
        },
      },
      required: ['summary'],
    },
  },
];

const SYSTEM_INSTRUCTION = `You are WebForge's autonomous AI senior software architect and coding agent.
You build, modify, and repair modern web applications EXCLUSIVELY by executing project tools.

CRITICAL OPERATIONAL RULES:
1. NEVER output large source code files in conversational markdown text. ALWAYS execute the tools:
   - Use 'create_file' to write new files.
   - Use 'update_file' to modify existing files.
   - Use 'read_file' to inspect existing code before modifying.
   - Use 'run_build' to verify code syntax and imports.
   - Use 'run_preview' to update the running website.
   - Use 'complete_task' when finished.

2. NO FIXED ARCHITECTURE & NO UNIVERSAL TEMPLATES:
   - The file structure MUST emerge from the user's specific request.
   - If the user asks for a simple landing page or pure HTML/CSS/JS (e.g. coffee shop landing page):
     create index.html, styles.css, script.js. There is NO requirement to create React components.
   - If the user asks for React e-commerce: create package.json, src/data/products.js, components (ProductCard.jsx, CartDrawer.jsx, etc.), src/App.jsx, src/styles.css.
   - If the user asks for a restaurant: create package.json, src/data/menu.js, MenuSection.jsx, ReservationModal.jsx, ChefSection.jsx, LocationSection.jsx, src/App.jsx, src/styles.css.
   - If the user asks for a SaaS dashboard: create package.json, src/data/metrics.js, Sidebar.jsx, MetricCard.jsx, AnalyticsChart.jsx, DataTable.jsx, src/App.jsx, src/styles.css.
   - DO NOT create unnecessary files (e.g. do not create Hero.jsx or Testimonials.jsx unless specifically relevant). Every file must have a reason to exist.

3. WRITE COMPLETE, WORKING, BEAUTIFUL CODE:
   - Always write complete file contents without placeholders like '// TODO' or '// add code here'.
   - Use modern typography, curated color palettes, smooth responsive layouts, and interactive state.

4. SURGICAL MODIFICATIONS FOR EXISTING PROJECTS:
   - For follow-up user requests (e.g. 'Add a booking page', 'Change theme to dark green', 'Make navbar sticky'):
     FIRST call 'inspect_project' to see the current codebase.
     Read the relevant files with 'read_file'.
     Modify ONLY the necessary files with 'update_file' or 'create_file'.
     DO NOT recreate or wipe the entire project. Preserve all existing functionality!

5. BUILD & ERROR RECOVERY:
   - After creating or editing files, call 'run_build'.
   - If 'run_build' reports errors, call 'get_build_errors', read the relevant file, fix the issue with 'update_file', and run 'run_build' again.
   - Once build succeeds, call 'run_preview' and then 'complete_task'.`;

/**
 * Executes a tool on the AgentEnvironment and formats the result.
 */
async function executeTool(env, toolName, args = {}) {
  switch (toolName) {
    case 'inspect_project':
      return env.inspect_project();

    case 'list_files':
      return env.list_files(args);

    case 'read_file':
      return { path: args.path, content: env.read_file(args) };

    case 'create_directory':
      return env.create_directory(args);

    case 'create_file':
      return env.create_file({ path: args.path, content: args.content, purpose: args.purpose || '' });

    case 'update_file':
      return env.update_file({ path: args.path, content: args.content, purpose: args.purpose || '' });

    case 'delete_file':
      return env.delete_file(args);

    case 'rename_file':
      return env.rename_file({ oldPath: args.old_path, newPath: args.new_path });

    case 'install_dependency':
      return env.install_dependency({ packageName: args.package_name, version: args.version });

    case 'run_build':
      return env.run_build();

    case 'get_build_errors':
      return { errors: env.get_build_errors() };

    case 'run_preview':
      return env.run_preview();

    case 'refresh_preview':
      return env.refresh_preview();

    case 'complete_task':
      return { completed: true, summary: args.summary || 'Task completed successfully.' };

    default:
      return { error: `Unknown tool: ${toolName}` };
  }
}

/**
 * Runs the Gemini Agent iterative tool-calling loop.
 */
export async function runGeminiAgent({
  request,
  existingFiles = {},
  previousMessages = [],
  onEvent = null,
}) {
  const startTime = Date.now();
  const apiKey = (process.env.GEMINI_API_KEY || '').trim();
  const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

  console.log('[Gemini] request started');
  console.log(`[Gemini] model: ${modelName}`);
  console.log(`[Gemini] user prompt received: "${request}"`);

  // Require API key - no silent fallback
  if (!apiKey) {
    const errorMsg =
      'GEMINI_API_KEY is missing or empty in server/.env. Please configure GEMINI_API_KEY in server/.env to use the Gemini coding agent.';
    console.error(`[Gemini Error] ${errorMsg}`);
    if (onEvent) {
      onEvent({
        type: 'error',
        error: errorMsg,
        devLog: {
          request,
          model: modelName,
          error: errorMsg,
          durationMs: Date.now() - startTime,
        },
      });
    }
    throw new Error(errorMsg);
  }

  const devLogs = [];
  const logDevEvent = (entry) => {
    const logItem = { ...entry, timestamp: new Date().toISOString() };
    devLogs.push(logItem);
    if (onEvent) {
      onEvent({ type: 'dev_log', log: logItem });
    }
  };

  // Initialize environment and tools
  const env = new AgentEnvironment({
    initialFiles: existingFiles,
    onEvent: (evt) => {
      if (onEvent) onEvent(evt);
      if (evt.type === 'file_created') {
        logDevEvent({ event: 'file_created', path: evt.path });
      } else if (evt.type === 'file_updated') {
        logDevEvent({ event: 'file_updated', path: evt.path });
      } else if (evt.type === 'build_started') {
        logDevEvent({ event: 'build_started' });
      } else if (evt.type === 'build_succeeded') {
        logDevEvent({ event: 'build_result', status: 'success' });
      } else if (evt.type === 'build_failed') {
        logDevEvent({ event: 'build_result', status: 'failed', errors: evt.errors });
      } else if (evt.type === 'preview_updated') {
        logDevEvent({ event: 'preview_status', status: 'ready' });
      } else if (evt.type === 'preview_failed') {
        logDevEvent({ event: 'preview_status', status: 'failed', error: evt.error });
      }
    },
  });

  logDevEvent({ event: 'request_started', model: modelName, request });

  // Initialize Gemini SDK
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: SYSTEM_INSTRUCTION,
    tools: [{ functionDeclarations: GEMINI_TOOL_DECLARATIONS }],
  });

  // Prepare initial prompt & context
  const fileList = Object.keys(existingFiles);
  let promptText = request;
  if (fileList.length > 0) {
    promptText = `[Existing Project: ${fileList.length} files: ${fileList.join(', ')}]\nUser Request: ${request}\n\nPlease inspect the project, read the necessary files, make the required changes, run the build, update the preview, and call complete_task.`;
  } else {
    promptText = `User Request: "${request}"\nPlease determine the appropriate architecture, create the necessary files with production-ready code, run the build, verify the preview, and call complete_task.`;
  }

  const chat = model.startChat({
    history: [],
  });

  let taskComplete = false;
  let finalSummary = '';
  let iterations = 0;
  const maxIterations = 25; // Prevent runaway loops

  env.emit({ type: 'activity_started', message: 'Understanding your requirements with Gemini...' });

  try {
    let sendResult = await chat.sendMessage(promptText);
    let response = sendResult.response;
    env.emit({ type: 'activity_completed', message: 'Requirements analyzed' });

    while (!taskComplete && iterations < maxIterations) {
      iterations++;
      let functionCalls = null;
      try {
        functionCalls = response.functionCalls();
      } catch (err) {
        functionCalls = null;
      }

      if (!functionCalls || functionCalls.length === 0) {
        // If Gemini returned a conversational response without a function call
        let text = '';
        try {
          text = response.text() || '';
        } catch (e) {
          text = '';
        }
        if (text) {
          finalSummary = text;
        }
        break;
      }

      const functionResponses = [];

      for (const call of functionCalls) {
        const { name, args } = call;
        console.log(`[Gemini] tool call: ${name}`);

        logDevEvent({
          event: 'tool_call',
          tool: name,
          args,
        });

        // Provide concise, user-facing activity messages
        if (name === 'inspect_project') {
          env.emit({ type: 'activity_started', message: 'Inspecting project files...' });
        } else if (name === 'read_file') {
          env.emit({ type: 'activity_started', message: `Reading ${args.path}...` });
        } else if (name === 'create_file') {
          env.emit({ type: 'activity_started', message: `Creating ${args.path}...` });
        } else if (name === 'update_file') {
          env.emit({ type: 'activity_started', message: `Updating ${args.path}...` });
        } else if (name === 'delete_file') {
          env.emit({ type: 'activity_started', message: `Deleting ${args.path}...` });
        } else if (name === 'run_build') {
          env.emit({ type: 'activity_started', message: 'Running build verification...' });
        } else if (name === 'run_preview') {
          env.emit({ type: 'activity_started', message: 'Starting preview...' });
        }

        // Execute the tool
        const toolResult = await executeTool(env, name, args);
        console.log(`[Gemini] tool result: ${name} -> ${JSON.stringify(toolResult).slice(0, 80)}...`);

        logDevEvent({
          event: 'tool_result',
          tool: name,
          result: toolResult,
        });

        // Activity completion notification
        if (name === 'inspect_project') {
          env.emit({ type: 'activity_completed', message: 'Project inspected' });
        } else if (name === 'create_file') {
          env.emit({ type: 'activity_completed', message: `Created ${args.path}` });
        } else if (name === 'update_file') {
          env.emit({ type: 'activity_completed', message: `Updated ${args.path}` });
        } else if (name === 'run_build') {
          if (toolResult.success) {
            env.emit({ type: 'activity_completed', message: 'Build successful' });
          } else {
            env.emit({ type: 'activity_started', message: `Build failed: ${toolResult.errors?.[0] || 'Errors detected'}` });
          }
        } else if (name === 'run_preview') {
          env.emit({ type: 'activity_completed', message: 'Preview ready' });
        } else if (name === 'complete_task') {
          taskComplete = true;
          finalSummary = toolResult.summary || 'Application built successfully.';
          env.emit({ type: 'activity_completed', message: 'Ready' });
        }

        functionResponses.push({
          functionResponse: {
            name,
            response: { output: toolResult },
          },
        });
      }

      if (taskComplete) {
        break;
      }

      // Return tool results back to Gemini
      sendResult = await chat.sendMessage(functionResponses);
      response = sendResult.response;
    }

    // Fallback verify build and preview if Gemini finished without calling them
    const buildCheck = env.run_build();
    if (buildCheck.success) {
      env.run_preview();
    }

    const durationMs = Date.now() - startTime;
    console.log(`[Gemini] request completed in ${durationMs}ms with ${Object.keys(env.files).length} files`);

    const summary = finalSummary || `Application engineered according to request with ${Object.keys(env.files).length} project files.`;

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
    console.error('[Gemini Error]', err);
    logDevEvent({
      event: 'request_error',
      error: err.message,
      durationMs: Date.now() - startTime,
    });
    throw err;
  }
}
