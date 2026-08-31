import { copyFileSync, mkdirSync, existsSync } from 'node:fs';

const routes = [
  'builder',
  'templates',
  'dashboard',
  'privacy-policy',
  'terms-of-service',
];

if (!existsSync('dist/index.html')) {
  throw new Error('dist/index.html was not found. Run the Vite build first.');
}

// Keep the 404 fallback for GitHub Pages SPA navigation.
copyFileSync('dist/index.html', 'dist/404.html');

// Create real HTML entry points for each React route.
// This allows GitHub Pages and Google to receive HTTP 200
// instead of 404 when these URLs are opened directly.
for (const route of routes) {
  const routeDir = `dist/${route}`;
  mkdirSync(routeDir, { recursive: true });
  copyFileSync('dist/index.html', `${routeDir}/index.html`);
}

console.log('Created GitHub Pages route entry points.');