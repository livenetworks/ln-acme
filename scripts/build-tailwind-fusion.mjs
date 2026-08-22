import fs from 'fs';
import path from 'path';

const REPO_ROOT = path.resolve();

const distCorePath = path.join(REPO_ROOT, 'dist/ln-ashlar-core.css');
const distThemePath = path.join(REPO_ROOT, 'dist/ln-ashlar-tailwind-theme.css');
const distFullTailwindPath = path.join(REPO_ROOT, 'dist/ln-ashlar-tailwind.css');

const demoDistThemePath = path.join(REPO_ROOT, 'demo/dist/ln-ashlar-tailwind-theme.css');
const demoDistFullTailwindPath = path.join(REPO_ROOT, 'demo/dist/ln-ashlar-tailwind.css');

if (!fs.existsSync(distCorePath)) {
	console.error('❌ dist/ln-ashlar-core.css not found. Please run sass build first.');
	process.exit(1);
}

if (!fs.existsSync(distThemePath)) {
	console.error('❌ dist/ln-ashlar-tailwind-theme.css not found. Please run tailwind cli first.');
	process.exit(1);
}

const coreCss = fs.readFileSync(distCorePath, 'utf8');
const themeCss = fs.readFileSync(distThemePath, 'utf8');

// Fusion: core + tailwind theme
const combinedCss = `${coreCss}\n/* Tailwind Theme Layer */\n${themeCss}`;

fs.writeFileSync(distFullTailwindPath, combinedCss, 'utf8');

// Mirror to demo/dist for demo shell loading
const demoDistDir = path.join(REPO_ROOT, 'demo/dist');
if (!fs.existsSync(demoDistDir)) {
	fs.mkdirSync(demoDistDir, { recursive: true });
}

fs.writeFileSync(demoDistThemePath, themeCss, 'utf8');
fs.writeFileSync(demoDistFullTailwindPath, combinedCss, 'utf8');

console.log('✓ Concatenated core + tailwind-theme → dist/ln-ashlar-tailwind.css');
