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
    '';

  const hasReactApp = Object.keys(normalizedFiles).some((k) => /\bApp\.(jsx?|tsx?)$/i.test(k));
  const htmlKey = Object.keys(normalizedFiles).find((k) => k.endsWith('index.html'));

  // 1. VANILLA HTML/CSS/JS MODE (e.g. coffee shop landing page without React)
  if (!hasReactApp && htmlKey) {
    let rawHtml = normalizedFiles[htmlKey] || '';
    const jsKey = Object.keys(normalizedFiles).find((k) => k.endsWith('script.js') || k.endsWith('main.js'));
    const scriptCode = jsKey ? normalizedFiles[jsKey] : '';

    // Inject CSS if present and not already embedded
    if (css && !rawHtml.includes('<style>')) {
      rawHtml = rawHtml.replace('</head>', `<style>\n${css}\n</style>\n</head>`);
    }

    // Inject script if present and not already embedded
    if (scriptCode && !rawHtml.includes(scriptCode)) {
      rawHtml = rawHtml.replace('</body>', `<script>\n${scriptCode}\n</script>\n</body>`);
    }

    return rawHtml;
  }

  // 2. MODULAR REACT APPLICATION MODE
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
    <div style="height:100vh;display:flex;align-items:center;justify-content:center;font-family:sans-serif;color:#94a3b8;font-size:14px;">
      Loading interactive preview…
    </div>
  </div>

  <script>
    (function() {
      try {
        const fileStore = ${JSON.stringify(normalizedFiles)};
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
          }
        });

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
              if (importName === 'lucide-react') return LucideProxy;

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
              window.React.useCallback
            );

            moduleRegistry[fileKey] = mod.exports;
            return mod.exports;
          } catch (err) {
            console.error('Compilation failed for ' + fileKey, err);
            throw err;
          }
        }

        // Find entry point (App.jsx, App.js, or main file)
        const appKey = Object.keys(fileStore).find((k) => /\\bApp\\.(jsx?|tsx?)$/i.test(k)) ||
                       Object.keys(fileStore).find((k) => k.endsWith('.jsx') || k.endsWith('.js'));

        if (!appKey) {
          document.getElementById('root').innerHTML = '<div style="padding:40px;text-align:center;color:#64748b;font-family:sans-serif;">No entry component found.</div>';
          return;
        }

        const appModule = getOrEvaluateModule(appKey);
        const AppComponent = appModule.default || appModule;

        if (AppComponent && (typeof AppComponent === 'function' || typeof AppComponent === 'object')) {
          const rootElement = document.getElementById('root');
          rootElement.innerHTML = '';
          const root = ReactDOM.createRoot(rootElement);
          root.render(React.createElement(AppComponent));
        } else {
          document.getElementById('root').innerHTML = '<div style="padding:40px;text-align:center;color:#64748b;font-family:sans-serif;">Entry component could not be rendered.</div>';
        }
      } catch (err) {
        console.error('Preview runtime error:', err);
        document.getElementById('root').innerHTML = '<div style="padding:32px;background:#fef2f2;border:1px solid #fecaca;color:#b91c1c;border-radius:12px;margin:24px;font-family:sans-serif;"><h3 style="margin:0 0 8px;">Build / Runtime Issue</h3><p style="margin:0 0 12px;font-size:13px;color:#991b1b;">The agent will inspect and resolve any compilation conflicts.</p><pre style="margin:0;font-size:12px;white-space:pre-wrap;background:#fff;padding:12px;border-radius:8px;border:1px solid #fee2e2;">' + (err.message || err) + '</pre></div>';
      }
    })();
  </script>
</body>
</html>`;
}
