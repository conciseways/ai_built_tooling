const fs = require('fs');
const path = require('path');

const source = path.join(__dirname, '..', 'packages', 'playing-cards');
const target = path.join(__dirname, '..', 'tools', 'playing-cards');

function syncDir(src, dest) {
  fs.rmSync(dest, { recursive: true, force: true });
  fs.cpSync(src, dest, { recursive: true, force: true });
}

syncDir(source, target);
console.log(`Synced ${source} → ${target}`);
