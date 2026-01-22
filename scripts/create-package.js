#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to create directory if it doesn't exist
function createDirectoryIfNotExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
}

// Function to create a file with content
function createFile(filePath, content) {
  fs.writeFileSync(filePath, content);
  console.log(`Created file: ${filePath}`);
}

// Main function to create a new package
async function createPackage() {
  return new Promise((resolve) => {
    rl.question('Enter package name: ', (packageName) => {
      if (!packageName) {
        console.error('Package name is required');
        rl.close();
        resolve(false);
        return;
      }

      // Sanitize package name
      const sanitizedName = packageName.toLowerCase().replace(/\s+/g, '-');
      
      rl.question('Enter package description: ', (description) => {
        rl.question('Package type (app/library) [app]: ', (type) => {
          const packageType = type || 'app';
          
          // Create package directory
          const packageDir = path.join(process.cwd(), 'packages', sanitizedName);
          createDirectoryIfNotExists(packageDir);
          
          // Create src directory
          const srcDir = path.join(packageDir, 'src');
          createDirectoryIfNotExists(srcDir);
          
          // Create package.json
          const packageJson = {
            name: sanitizedName,
            version: '0.1.0',
            description: description || `${packageName} package`,
            main: packageType === 'library' ? 'dist/index.js' : 'src/index.js',
            scripts: {
              test: 'echo "Error: no test specified" && exit 1',
              start: packageType === 'app' ? 'parcel src/index.html' : 'echo "No start script for libraries"',
              build: packageType === 'app' ? 'parcel build src/index.html' : 'echo "No build script for libraries yet"'
            },
            keywords: [sanitizedName],
            author: '',
            license: 'MIT',
            devDependencies: packageType === 'app' ? { 'parcel-bundler': '^1.12.5' } : {}
          };
          
          createFile(
            path.join(packageDir, 'package.json'),
            JSON.stringify(packageJson, null, 2)
          );
          
          // Create README.md
          const readmeContent = `# ${packageName}

${description || `${packageName} package`}

## Installation

\`\`\`bash
npm install
\`\`\`

## Usage

\`\`\`bash
npm start
\`\`\`

## License

MIT
`;
          
          createFile(path.join(packageDir, 'README.md'), readmeContent);
          
          // Create basic files based on package type
          if (packageType === 'app') {
            // Create HTML file
            const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${packageName}</title>
  <link rel="stylesheet" href="./styles/main.css">
</head>
<body>
  <h1>${packageName}</h1>
  <div id="app"></div>
  <script src="./js/app.js"></script>
</body>
</html>`;
            
            createFile(path.join(srcDir, 'index.html'), htmlContent);
            
            // Create styles directory and CSS file
            const stylesDir = path.join(srcDir, 'styles');
            createDirectoryIfNotExists(stylesDir);
            
            const cssContent = `/* Main styles for ${packageName} */
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

h1 {
  color: #2c3e50;
}`;
            
            createFile(path.join(stylesDir, 'main.css'), cssContent);
            
            // Create js directory and app.js file
            const jsDir = path.join(srcDir, 'js');
            createDirectoryIfNotExists(jsDir);
            
            const jsContent = `// Main application file for ${packageName}
document.addEventListener('DOMContentLoaded', () => {
  console.log('${packageName} application initialized');
  
  const app = document.getElementById('app');
  app.innerHTML = '<p>Welcome to ${packageName}!</p>';
});`;
            
            createFile(path.join(jsDir, 'app.js'), jsContent);
          } else {
            // Create library index.js
            const indexContent = `// Main export file for ${packageName} library

/**
 * Example function
 * @param {string} name - Name to greet
 * @returns {string} Greeting message
 */
export function greet(name) {
  return \`Hello, \${name}! Welcome to ${packageName}.\`;
}

// Add your library exports here
`;
            
            createFile(path.join(srcDir, 'index.js'), indexContent);
          }
          
          console.log(`\nPackage '${sanitizedName}' created successfully!`);
          console.log(`\nTo get started, run:\n  cd packages/${sanitizedName}\n  npm install\n  npm start`);
          
          rl.close();
          resolve(true);
        });
      });
    });
  });
}

// Run the script
createPackage()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Error creating package:', err);
    process.exit(1);
  });
