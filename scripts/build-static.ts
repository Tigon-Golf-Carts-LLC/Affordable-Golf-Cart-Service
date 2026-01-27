import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const DOCS_DIR = 'docs';
const DIST_DIR = 'dist/public';

console.log('🔨 Building static site for GitHub Pages...\n');

// Step 1: Clean docs directory
console.log('📁 Cleaning docs directory...');
if (fs.existsSync(DOCS_DIR)) {
  fs.rmSync(DOCS_DIR, { recursive: true });
}
fs.mkdirSync(DOCS_DIR, { recursive: true });

// Step 2: Build the Vite app
console.log('⚡ Building Vite app...');
execSync('npx vite build --config vite.static.config.ts', { stdio: 'inherit' });

// Step 3: Copy built files to docs
console.log('📋 Copying built files to docs...');
function copyDir(src: string, dest: string) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}
copyDir(DIST_DIR, DOCS_DIR);

// Step 4: Copy public assets
console.log('🖼️  Copying public assets...');
const publicDir = 'client/public';
if (fs.existsSync(publicDir)) {
  const entries = fs.readdirSync(publicDir, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(publicDir, entry.name);
    const destPath = path.join(DOCS_DIR, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Step 5: Create 404.html for SPA routing on GitHub Pages
console.log('🔄 Creating 404.html for SPA routing...');
const indexHtml = fs.readFileSync(path.join(DOCS_DIR, 'index.html'), 'utf-8');
fs.writeFileSync(path.join(DOCS_DIR, '404.html'), indexHtml);

// Step 6: Create .nojekyll file to prevent Jekyll processing
console.log('📝 Creating .nojekyll file...');
fs.writeFileSync(path.join(DOCS_DIR, '.nojekyll'), '');

// Step 7: Create CNAME file for custom domain (if needed)
console.log('🌐 Creating CNAME file for custom domain...');
fs.writeFileSync(path.join(DOCS_DIR, 'CNAME'), 'affordablegolfcartservice.com');

console.log('\n✅ Static build complete!');
console.log(`📂 Output directory: ${DOCS_DIR}/`);
console.log('\n📋 Next steps:');
console.log('1. Commit the docs folder to your repository');
console.log('2. Go to GitHub repo Settings > Pages');
console.log('3. Set Source to "Deploy from a branch"');
console.log('4. Select "main" branch and "/docs" folder');
console.log('5. Save and wait for deployment\n');
