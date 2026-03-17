const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Source and destination directories
const sourceDir = path.join(__dirname, 'src', 'time-tracker-pwa');
const distDir = path.join(__dirname, 'dist');

// Create dist directory if it doesn't exist
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Copy HTML file
console.log('Copying HTML file...');
fs.copyFileSync(
  path.join(sourceDir, 'index.html'),
  path.join(distDir, 'index.html')
);

// Create CSS directory and copy CSS files
const cssSourceDir = path.join(sourceDir, 'css');
const cssDistDir = path.join(distDir, 'css');
if (!fs.existsSync(cssDistDir)) {
  fs.mkdirSync(cssDistDir, { recursive: true });
}

console.log('Copying CSS files...');
fs.readdirSync(cssSourceDir).forEach(file => {
  if (file.endsWith('.css')) {
    fs.copyFileSync(
      path.join(cssSourceDir, file),
      path.join(cssDistDir, file)
    );
  }
});

// Create JS directory and copy JS files
const jsSourceDir = path.join(sourceDir, 'js');
const jsDistDir = path.join(distDir, 'js');
if (!fs.existsSync(jsDistDir)) {
  fs.mkdirSync(jsDistDir, { recursive: true });
}

console.log('Copying JS files...');
fs.readdirSync(jsSourceDir).forEach(file => {
  if (file.endsWith('.js')) {
    fs.copyFileSync(
      path.join(jsSourceDir, file),
      path.join(jsDistDir, file)
    );
  }
});

// Copy service worker
console.log('Copying service worker...');
fs.copyFileSync(
  path.join(sourceDir, 'service-worker.js'),
  path.join(distDir, 'service-worker.js')
);

// Copy manifest
console.log('Copying manifest...');
fs.copyFileSync(
  path.join(sourceDir, 'manifest.json'),
  path.join(distDir, 'manifest.json')
);

// Create images directory and copy image files
const imgSourceDir = path.join(sourceDir, 'images');
const imgDistDir = path.join(distDir, 'images');
if (fs.existsSync(imgSourceDir)) {
  if (!fs.existsSync(imgDistDir)) {
    fs.mkdirSync(imgDistDir, { recursive: true });
  }

  console.log('Copying image files...');
  fs.readdirSync(imgSourceDir).forEach(file => {
    if (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.svg') || file.endsWith('.gif')) {
      fs.copyFileSync(
        path.join(imgSourceDir, file),
        path.join(imgDistDir, file)
      );
    }
  });
}

console.log('Build completed successfully!');
