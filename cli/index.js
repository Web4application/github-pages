#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { Command } = require('commander');
const inquirer = require('inquirer');
const os = require('os');

const program = new Command();
const CONFIG_PATH = path.join(os.homedir(), '.web4clirc');

// Utility Functions
function copyFolder(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const item of fs.readdirSync(src)) {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    fs.statSync(srcPath).isDirectory()
      ? copyFolder(srcPath, destPath)
      : fs.copyFileSync(srcPath, destPath);
  }
}

function saveConfig(config) {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
}

function loadConfig() {
  if (fs.existsSync(CONFIG_PATH)) {
    return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
  }
  return {};
}

// 🧱 Init Project Command
program
  .command('init')
  .description('Create a new Web4App project')
  .option('--template <template>', 'Choose a template')
  .option('--name <name>', 'Project name')
  .option('--git', 'Initialize git', true)
  .option('--install', 'Run npm install', true)
  .action(async (options) => {
    const config = loadConfig();

    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Project name:',
        default: options.name || 'my-web4-app',
      },
      {
        type: 'list',
        name: 'template',
        message: 'Choose a template:',
        default: options.template || config.defaultTemplate || 'default',
        choices: ['default', 'vue-tailwind'],
      },
      {
        type: 'confirm',
        name: 'git',
        message: 'Initialize git?',
        default: options.git ?? config.autoGit ?? true,
      },
      {
        type: 'confirm',
        name: 'install',
        message: 'Install dependencies?',
        default: options.install ?? config.autoInstall ?? true,
      }
    ]);

    const templateDir = path.join(__dirname, '..', 'template', answers.template);
    const targetDir = path.resolve(process.cwd(), answers.name);

    if (fs.existsSync(targetDir)) {
      console.error(`❌ Directory "${answers.name}" already exists.`);
      process.exit(1);
    }

    console.log(`📁 Creating project at ${targetDir}...`);
    copyFolder(templateDir, targetDir);
    process.chdir(targetDir);

    if (answers.git) {
      try {
        execSync('git init', { stdio: 'inherit' });
        console.log('✅ Git initialized');
      } catch {
        console.warn('⚠️ Git init failed');
      }
    }

    if (answers.install) {
      try {
        execSync('npm install', { stdio: 'inherit' });
        console.log('📦 Dependencies installed');
      } catch {
        console.warn('⚠️ Install failed');
      }
    }

    console.log(`🚀 Done! Project "${answers.name}" is ready.`);
  });

// ⚙️ Config Command
program
  .command('config')
  .description('Save global defaults')
  .action(async () => {
    const configAnswers = await inquirer.prompt([
      {
        type: 'list',
        name: 'defaultTemplate',
        message: 'Default template:',
        choices: ['default', 'vue-tailwind'],
      },
      {
        type: 'confirm',
        name: 'autoGit',
        message: 'Auto initialize git by default?',
        default: true,
      },
      {
        type: 'confirm',
        name: 'autoInstall',
        message: 'Auto install deps by default?',
        default: true,
      }
    ]);
    saveConfig(configAnswers);
    console.log('✅ Saved config:', configAnswers);
  });

// 📦 env:init Command
program
  .command('env:init')
  .description('Generate .env, .env.py and config.py files')
  .action(() => {
    const targetDir = process.cwd();
    const envPath = path.join(targetDir, '.env');
    const envPyPath = path.join(targetDir, '.env.py');
    const configPyPath = path.join(targetDir, 'config.py');

    const envContent = `API_URL=https://api.example.com\nDEBUG=True\nPROJECT_NAME=Web4App\n`;
    const envPyContent = `API_URL = "https://api.example.com"\nDEBUG = True\nPROJECT_NAME = "Web4App"\n`;
    const configContent = `
import os
from dotenv import load_dotenv

load_dotenv()

try:
    import .env as pyenv
except ImportError:
    pyenv = None

API_URL = os.getenv("API_URL") or getattr(pyenv, "API_URL", "http://localhost")
DEBUG = (os.getenv("DEBUG") or str(getattr(pyenv, "DEBUG", False))) == "True"
PROJECT_NAME = os.getenv("PROJECT_NAME") or getattr(pyenv, "PROJECT_NAME", "UnnamedApp")
`.trimStart();

    fs.writeFileSync(envPath, envContent);
    fs.writeFileSync(envPyPath, envPyContent);
    fs.writeFileSync(configPyPath, configContent);

    console.log('✅ Environment files created:');
    console.log(`  - ${envPath}`);
    console.log(`  - ${envPyPath}`);
    console.log(`  - ${configPyPath}`);
  });

program.parse();
