import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const frontendDir = path.join(__dirname, 'frontend');
const distDir = path.join(frontendDir, 'dist');
const publicDir = path.join(__dirname, 'backend', 'public');

execSync('node ./node_modules/vite/bin/vite.js build', {
  cwd: frontendDir,
  stdio: 'inherit'
});

if (fs.existsSync(distDir)) {
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  fs.cpSync(distDir, publicDir, { recursive: true, force: true });
}
