const res = await fetch('https://unpkg.com/@babel/standalone/babel.min.js');
const src = await res.text();
const vm = await import('vm');
const ctx = { window: {}, console };
ctx.window = ctx;
vm.runInNewContext(src, ctx);
const Babel = ctx.Babel;
const code = `import React from 'react';
export default function Hero() {
  return <h1>Hello WebForge</h1>;
}`;
const result = Babel.transform(code, {
  presets: [['react', { runtime: 'classic' }]],
  plugins: ['transform-modules-commonjs']
});
console.log('TRANSPILED CLASSIC RESULT:\n' + result.code);
