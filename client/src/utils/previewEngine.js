/**
 * Fast In-Browser Preview Generator
 *
 * Compiles modular React components or renders vanilla HTML/CSS/JS applications
 * directly in an iframe. Runs 100% locally with zero external server dependencies.
 */

export function generatePreviewHtml(files = {}) {
  const normalizedFiles = {};
  for (const [path, content] of Object.entries(files)) {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const code = typeof content === 'string' ? content : content?.code || '';
    normalizedFiles[cleanPath] = code;
  }

  const css =
    normalizedFiles['/src/styles.css'] ||
    normalizedFiles['/styles.css'] ||
    normalizedFiles['styles.css'] ||
    normalizedFiles['/src/index.css'] ||
    normalizedFiles['/index.css'] ||
    '';

  const hasReactApp = Object.keys(normalizedFiles).some((k) => /\bApp\.(jsx?|tsx?)$/i.test(k));
  const htmlKey = Object.keys(normalizedFiles).find((k) => k.endsWith('index.html'));

  // 1. VANILLA HTML/CSS/JS MODE (e.g. coffee shop landing page without React)
  if (!hasReactApp && htmlKey) {
    let rawHtml = normalizedFiles[htmlKey] || '';
    const jsKey = Object.keys(normalizedFiles).find((k) => k.endsWith('script.js') || k.endsWith('main.js'));
    const scriptCode = jsKey ? normalizedFiles[jsKey] : '';

    // Inject CSS if present and not already embedded
    if (css && !rawHtml.includes('<style>') && rawHtml.includes('</head>')) {
      rawHtml = rawHtml.replace('</head>', `<style>\n${css}\n</style>\n</head>`);
    }

    // Inject script if present and not already embedded
    if (scriptCode && !rawHtml.includes(scriptCode) && rawHtml.includes('</body>')) {
      rawHtml = rawHtml.replace('</body>', `<script>\n${scriptCode}\n</script>\n</body>`);
    }

    return rawHtml;
  }

  // 2. MODULAR REACT APPLICATION MODE
  // CRITICAL: Safely escape JSON to prevent </script> in file content from breaking the inline <script> tag
  const safeFileStoreJson = JSON.stringify(normalizedFiles)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Application Preview</title>

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">

  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>

  <!-- React 18 UMD -->
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>

  <!-- Babel Standalone (JSX transpiler) -->
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>

  <style>
    ${css}
  </style>
</head>
<body>
  <div id="root">
    <div style="height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:system-ui,-apple-system,sans-serif;color:#64748b;font-size:14px;gap:12px;">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation:spin 1s linear infinite;">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"/>
        <path d="M12 2a10 10 0 0 1 10 10"/>
      </svg>
      <style>@keyframes spin{to{transform:rotate(360deg)}}</style>
      <span>Rendering interactive application…</span>
    </div>
  </div>

  <script>
    (function() {
      // Global error handler to catch unexpected issues
      function renderError(title, details) {
        var root = document.getElementById('root');
        if (!root) return;
        root.innerHTML = '<div style="padding:28px;background:#fef2f2;border:1px solid #fecaca;color:#991b1b;border-radius:12px;margin:24px;font-family:system-ui,-apple-system,sans-serif;box-shadow:0 4px 6px rgba(0,0,0,0.05);">' +
          '<h3 style="margin:0 0 8px;font-size:16px;font-weight:700;">' + (title || 'Application Error') + '</h3>' +
          '<p style="margin:0 0 12px;font-size:13px;color:#b91c1c;">A runtime error occurred in the preview sandbox.</p>' +
          '<pre style="margin:0;font-size:12px;white-space:pre-wrap;background:#ffffff;padding:12px;border-radius:8px;border:1px solid #fee2e2;color:#7f1d1d;max-height:260px;overflow:auto;">' + (details || '') + '</pre>' +
        '</div>';
      }

      window.onerror = function(msg, url, line, col, error) {
        renderError('Application Runtime Error', (msg || error) + (line ? ' (Line: ' + line + ')' : ''));
      };

      try {
        const fileStore = ${safeFileStoreJson};
        const moduleRegistry = {};

        // Icon proxy for Lucide icons
        const LucideProxy = new Proxy({}, {
          get: function(target, prop) {
            if (typeof prop !== 'string') return undefined;
            return function LucideIcon(props) {
              const size = props?.size || 18;
              const color = props?.color || 'currentColor';
              const className = props?.className || '';
              return window.React.createElement('svg', {
                width: size,
                height: size,
                viewBox: '0 0 24 24',
                fill: 'none',
                stroke: color,
                strokeWidth: '2',
                strokeLinecap: 'round',
                strokeLinejoin: 'round',
                className: className,
                style: { display: 'inline-block', verticalAlign: 'middle', ...props?.style }
              }, 
              window.React.createElement('circle', { cx: '12', cy: '12', r: '9', opacity: '0.2' }),
              window.React.createElement('path', { d: 'M12 8v8m-4-4h8' }));
            };
          },
          has: function() { return true; }
        });

        // Built-in Lightweight React Router (Supports multi-route navigation in iframe)
        const RouterContext = window.React.createContext({ currentPath: '/' });

        function MockRouterComponent(props) {
          const [currentPath, setCurrentPath] = window.React.useState(function() {
            return window.location.hash.replace(/^#/, '') || '/';
          });

          window.React.useEffect(function() {
            function handleHash() {
              var p = window.location.hash.replace(/^#/, '') || '/';
              setCurrentPath(p);
            }
            window.addEventListener('hashchange', handleHash);
            return function() { window.removeEventListener('hashchange', handleHash); };
          }, []);

          return window.React.createElement(
            RouterContext.Provider,
            { value: { currentPath: currentPath, setCurrentPath: setCurrentPath } },
            props.children
          );
        }

        function MockRoutes(props) {
          const ctx = window.React.useContext(RouterContext);
          const currentPath = ctx.currentPath || '/';
          const childArray = window.React.Children.toArray(props.children);

          let matched = null;
          for (var i = 0; i < childArray.length; i++) {
            var child = childArray[i];
            if (!child || !child.props) continue;
            var path = child.props.path;
            var isIndex = child.props.index;
            var element = child.props.element || child.props.children;

            if (isIndex && (currentPath === '/' || currentPath === '')) {
              matched = element;
              break;
            }
            if (path && (path === currentPath || (path.startsWith('/') && path === currentPath) || ('/' + path) === currentPath)) {
              matched = element;
              break;
            }
          }

          if (!matched && childArray.length > 0) {
            var first = childArray[0];
            matched = first.props?.element || first.props?.children || first;
          }

          return matched || null;
        }

        function MockRoute(props) {
          return props.element || props.children || null;
        }

        function MockLink(props) {
          var target = props.to || '/';
          var targetHash = '#' + (target.startsWith('/') ? target : '/' + target);
          return window.React.createElement('a', {
            href: targetHash,
            className: props.className,
            style: props.style,
            onClick: function(e) {
              if (props.onClick) props.onClick(e);
            }
          }, props.children);
        }

        const MockRouter = {
          BrowserRouter: MockRouterComponent,
          HashRouter: MockRouterComponent,
          MemoryRouter: MockRouterComponent,
          Router: MockRouterComponent,
          Routes: MockRoutes,
          Route: MockRoute,
          Link: MockLink,
          NavLink: MockLink,
          useNavigate: function() {
            return function(to) {
              if (typeof to === 'string') {
                window.location.hash = '#' + (to.startsWith('/') ? to : '/' + to);
              }
            };
          },
          useLocation: function() {
            var p = window.location.hash.replace(/^#/, '') || '/';
            return { pathname: p, search: '', hash: '' };
          },
          useParams: function() { return {}; }
        };

        // Classnames / clsx utility
        function clsx() {
          var str = '';
          for (var i = 0; i < arguments.length; i++) {
            var arg = arguments[i];
            if (!arg) continue;
            if (typeof arg === 'string') str += (str ? ' ' : '') + arg;
            else if (Array.isArray(arg)) {
              var inner = clsx.apply(null, arg);
              if (inner) str += (str ? ' ' : '') + inner;
            } else if (typeof arg === 'object') {
              for (var key in arg) {
                if (arg[key]) str += (str ? ' ' : '') + key;
              }
            }
          }
          return str;
        }

        // Path resolution helper for relative imports
        function resolveRelativePath(currentFile, importPath) {
          if (!importPath.startsWith('.')) return importPath;
          const currentDir = currentFile ? currentFile.substring(0, currentFile.lastIndexOf('/')) : '';
          const rawParts = (currentDir + '/' + importPath).split('/');
          const resolved = [];
          for (const p of rawParts) {
            if (p === '' || p === '.') continue;
            if (p === '..') resolved.pop();
            else resolved.push(p);
          }
          return '/' + resolved.join('/');
        }

        // Find file in fileStore by flexible matching
        function findFileKey(target) {
          const cleanTarget = target.startsWith('/') ? target : '/' + target;
          const candidates = [
            cleanTarget,
            cleanTarget + '.jsx',
            cleanTarget + '.js',
            cleanTarget + '/index.jsx',
            cleanTarget + '/index.js',
            cleanTarget.replace(/\\.(jsx?|tsx?)$/, ''),
            cleanTarget.startsWith('/src') ? cleanTarget.replace(/^\\/src/, '') : '/src' + cleanTarget,
            (cleanTarget.startsWith('/src') ? cleanTarget.replace(/^\\/src/, '') : '/src' + cleanTarget) + '.jsx',
            (cleanTarget.startsWith('/src') ? cleanTarget.replace(/^\\/src/, '') : '/src' + cleanTarget) + '.js',
          ];

          for (const cand of candidates) {
            if (fileStore[cand]) return cand;
          }

          // Fallback: match by basename
          const bareName = cleanTarget.split('/').pop().replace(/\\.(jsx?|tsx?)$/, '');
          for (const key of Object.keys(fileStore)) {
            const keyBare = key.split('/').pop().replace(/\\.(jsx?|tsx?)$/, '');
            if (keyBare === bareName && (key.endsWith('.js') || key.endsWith('.jsx'))) {
              return key;
            }
          }

          return null;
        }

        // Lazy module evaluator
        function getOrEvaluateModule(fileKey) {
          if (moduleRegistry[fileKey]) return moduleRegistry[fileKey];

          const sourceCode = fileStore[fileKey];
          if (!sourceCode) return {};

          try {
            const compiled = Babel.transform(sourceCode, {
              presets: [['react', { runtime: 'classic' }]],
              plugins: ['transform-modules-commonjs']
            }).code;

            const mod = { exports: {} };

            function moduleRequire(importName) {
              if (importName.endsWith('.css') || importName.includes('.css')) return {};
              if (importName === 'react') return window.React;
              if (importName === 'react-dom' || importName === 'react-dom/client') return window.ReactDOM;
              if (importName === 'react-router-dom' || importName === 'react-router') {
                return MockRouter;
              }
              if (importName === 'lucide-react') return LucideProxy;
              if (importName === 'clsx' || importName === 'classnames') return { default: clsx, clsx: clsx };

              const resolvedPath = resolveRelativePath(fileKey, importName);
              const foundKey = findFileKey(resolvedPath) || findFileKey(importName);
              if (foundKey) {
                return getOrEvaluateModule(foundKey);
              }
              return {};
            }

            const runner = new Function(
              'require',
              'module',
              'exports',
              'React',
              'useState',
              'useEffect',
              'useMemo',
              'useRef',
              'useCallback',
              'useContext',
              'useReducer',
              compiled
            );

            runner(
              moduleRequire,
              mod,
              mod.exports,
              window.React,
              window.React.useState,
              window.React.useEffect,
              window.React.useMemo,
              window.React.useRef,
              window.React.useCallback,
              window.React.useContext,
              window.React.useReducer
            );

            moduleRegistry[fileKey] = mod.exports;
            return mod.exports;
          } catch (err) {
            console.error('Compilation failed for ' + fileKey, err);
            throw err;
          }
        }

        // Check if path is a config or build file that must never run as a React component
        function isConfigFile(path) {
          const lower = (path || '').toLowerCase();
          return lower.includes('config.') ||
                 lower.includes('.config') ||
                 lower.endsWith('vite.config.js') ||
                 lower.endsWith('tailwind.config.js') ||
                 lower.endsWith('postcss.config.js') ||
                 lower.endsWith('eslint.config.js') ||
                 lower.endsWith('package.json');
        }

        // Filter candidates to valid application source files
        const candidateKeys = Object.keys(fileStore).filter(function(k) {
          return !isConfigFile(k);
        });

        // Find entry point prioritizing App.jsx, then main.jsx, then components in src/
        const appKey = candidateKeys.find(function(k) { return /\\bApp\\.(jsx?|tsx?)$/i.test(k); }) ||
                       candidateKeys.find(function(k) { return k.endsWith('main.jsx') || k.endsWith('main.js'); }) ||
                       candidateKeys.find(function(k) { return k.endsWith('index.jsx') || k.endsWith('index.js'); }) ||
                       candidateKeys.find(function(k) { return (k.startsWith('/src') || k.startsWith('src')) && (k.endsWith('.jsx') || k.endsWith('.tsx')); }) ||
                       candidateKeys.find(function(k) { return k.endsWith('.jsx') || k.endsWith('.tsx'); }) ||
                       candidateKeys.find(function(k) { return (k.startsWith('/src') || k.startsWith('src')) && k.endsWith('.js'); });

        if (!appKey) {
          renderError('Building Application...', 'Generating components and styles... If generation is complete, click Retry or Refresh to view the full application.');
          return;
        }

        const appModule = getOrEvaluateModule(appKey);
        let AppComponent = appModule.default || appModule.App;
        if (!AppComponent && typeof appModule === 'function') {
          AppComponent = appModule;
        }
        if (!AppComponent && typeof appModule === 'object') {
          const candidate = Object.values(appModule).find(function(v) {
            return typeof v === 'function' || (v && typeof v === 'object' && v.$$typeof);
          });
          if (candidate) AppComponent = candidate;
        }

        if (AppComponent && (typeof AppComponent === 'function' || typeof AppComponent === 'object')) {
          const rootElement = document.getElementById('root');
          rootElement.innerHTML = '';
          const root = ReactDOM.createRoot(rootElement);

          // Error boundary wrapper
          class ErrorBoundary extends React.Component {
            constructor(props) {
              super(props);
              this.state = { hasError: false, error: null };
            }
            static getDerivedStateFromError(error) {
              return { hasError: true, error: error };
            }
            componentDidCatch(error, errorInfo) {
              console.error('React Component Error:', error, errorInfo);
            }
            render() {
              if (this.state.hasError) {
                return React.createElement('div', {
                  style: {
                    padding: '24px',
                    margin: '20px',
                    backgroundColor: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: '12px',
                    color: '#991b1b',
                    fontFamily: 'system-ui,-apple-system,sans-serif'
                  }
                },
                React.createElement('h3', { style: { margin: '0 0 8px', fontWeight: 700 } }, 'Rendering Issue in Component'),
                React.createElement('pre', {
                  style: {
                    margin: 0,
                    fontSize: '12px',
                    background: '#fff',
                    padding: '10px',
                    borderRadius: '6px',
                    border: '1px solid #fee2e2',
                    whiteSpace: 'pre-wrap'
                  }
                }, String(this.state.error?.message || this.state.error)));
              }
              return this.props.children;
            }
          }

          root.render(
            React.createElement(ErrorBoundary, null, React.createElement(AppComponent))
          );
        } else {
          renderError('Entry Component Error', 'The entry module ' + appKey + ' did not export a valid React component.');
        }
      } catch (err) {
        console.error('Preview runtime error:', err);
        renderError('Compilation / Runtime Issue', err.message || String(err));
      }
    })();
  </script>
</body>
</html>`;
}
