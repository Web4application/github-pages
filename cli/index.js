#!/usr/bin/env node

const { Command } = require('commander');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const program = new Command();

const TEMPLATE_DIR = path.join(__dirname, '..', 'template');

function copyFolder(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });

  for (const item of fs.readdirSync(src)) {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);

    const stat = fs.statSync(srcPath);
    if (stat.isDirectory()) {
      copyFolder(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

program
  .name('web4cli')
  .version('1.0.0')
  .description('Web4App Project Scaffolder CLI')
  .argument('[projectName]', 'Name of the project folder', 'my-web4-app')
  .option('--no-git', 'Skip git initialization')
  .option('--no-install', 'Skip npm install')
  .action((projectName, options) => {
    const targetDir = path.resolve(process.cwd(), projectName);

    if (fs.existsSync(targetDir)) {
      console.error(`❌ Directory "${projectName}" already exists.`);
      process.exit(1);
    }

    console.log(`📦 Creating project in "${targetDir}"...`);
    copyFolder(TEMPLATE_DIR, targetDir);
    console.log(`✅ Files copied.`);

    process.chdir(targetDir);

    if (options.git) {
      try {
        execSync('git init', { stdio: 'inherit' });
        console.log('🔧 Git initialized.');
      } catch (err) {
        console.warn('⚠️ Git initialization failed.');
      }
    }

    if (options.install) {
      try {
        execSync('npm install', { stdio: 'inherit' });
        console.log('📦 Dependencies installed.');
      } catch (err) {
        console.warn('⚠️ npm install failed.');
      }
    }

    console.log(`🚀 Project ready in ${projectName}`);
  });

program.parse();
