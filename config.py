# config.py

import os
from dotenv import load_dotenv

# Load from .env file if present
load_dotenv()

# Fallbacks from .env.py
try:
    import .env as pyenv
except ImportError:
    pyenv = None

API_URL = os.getenv("API_URL") or getattr(pyenv, "API_URL", "http://localhost")
DEBUG = (os.getenv("DEBUG") or str(getattr(pyenv, "DEBUG", False))) == "True"
PROJECT_NAME = os.getenv("PROJECT_NAME") or getattr(pyenv, "PROJECT_NAME", "UnnamedApp")
