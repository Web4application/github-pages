#!/usr/bin/env node
const envInit = require('./commands/env-init');

const command = process.argv[2];

switch (command) {
  case 'env:init':
    envInit();
    break;

  // other cases...
  default:
    console.log('Usage: web4cli <command>\nCommands: init, env:init');
}

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { Command } = require('commander');
const inquirer = require('inquirer');
const os = require('os');

const CONFIG_PATH = path.join(os.homedir(), '.web4clirc');

const program = new Command();

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
      } catch (err) {
        console.warn('⚠️ Git init failed');
      }
    }

    if (answers.install) {
      try {
        execSync('npm install', { stdio: 'inherit' });
        console.log('📦 Dependencies installed');
      } catch (err) {
        console.warn('⚠️ Install failed');
      }
    }

    console.log(`🚀 Done! Project "${answers.name}" is ready.`);
  });

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

program.parse();
