const fs = require('fs');
const path = require('path');

module.exports = function envInit(targetDir = process.cwd()) {
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
};
