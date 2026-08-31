import {
  copyFileSync,
  mkdirSync,
  existsSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';

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

const indexHtml = readFileSync('dist/index.html', 'utf8');

// Keep the 404 fallback for GitHub Pages SPA navigation.
copyFileSync('dist/index.html', 'dist/404.html');

// Create static HTML entry points for React routes.
for (const route of routes) {
  const routeDir = `dist/${route}`;

  mkdirSync(routeDir, { recursive: true });

  let html = indexHtml;

  // Builder-specific SEO
  if (route === 'builder') {
    html = html
      .replace(
        /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
        '<meta name="description" content="Create a professional, ATS-friendly resume online with Resume Builder. Customize your resume with easy-to-use tools, preview it instantly, and download it as a PDF." />'
      )
      .replace(
        /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
        '<link rel="canonical" href="https://resumebuilderonline.github.io/resume-builder/builder" />'
      )
      .replace(
        /<title>[\s\S]*?<\/title>/i,
        '<title>Free Online Resume Builder - Create ATS-Friendly Resumes</title>'
      );
  }

  // Templates-specific SEO
  if (route === 'templates') {
    html = html
      .replace(
        /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
        '<meta name="description" content="Explore professional resume templates with Resume Builder. Choose modern, ATS-friendly resume templates, customize your resume, preview it instantly, and download it as a PDF." />'
      )
      .replace(
        /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
        '<link rel="canonical" href="https://resumebuilderonline.github.io/resume-builder/templates" />'
      )
      .replace(
        /<title>[\s\S]*?<\/title>/i,
        '<title>Professional Resume Templates - ATS-Friendly Templates</title>'
      );
  }

  writeFileSync(`${routeDir}/index.html`, html);
}

console.log('Created GitHub Pages route entry points with SEO metadata.');