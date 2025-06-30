#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const ncp = require('ncp').ncp;

const templateDir = path.join(__dirname, '..');
const targetDir = process.argv[2] || 'my-demo-app';

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir);
  ncp(templateDir, targetDir, function (err) {
    if (err) {
      return console.error(err);
    }
    console.log(`🚀 Project created in ${targetDir}`);
  });
} else {
  console.error(`❌ Directory ${targetDir} already exists.`);
}
