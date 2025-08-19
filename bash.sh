# Set API key (production)
vercel secrets add api-url https://app.web4app.com
# Open a terminal (Command Prompt or PowerShell for Windows, Terminal for macOS or Linux)

# Ensure Git is installed
# Visit https://git-scm.com to download and install console Git if not already installed

# Clone the repository
git clone https://github.com/Abblix/Oidc.Server.git

# Navigate to the project directory
cd Oidc.Server

# Check if .NET SDK is installed
dotnet --version  # Check the installed version of .NET SDK
# Visit the official Microsoft website to install or update it if necessary

# Restore dependencies
dotnet restore

# Compile the project
dotnet build


# Set database URL (production)
vercel secrets add db-url postgres://user:password@host:5432/db

# Preview env with staging URLs
vercel secrets add api-url-staging https://staging-api.myapp.com
vercel secrets add db-url-staging postgres://staging_user:pw@staging_host:5432/staging_db
@dependabot:  git rebase --continue
 npm install
 npm run dev

npm install vue-router@4 tailwindcss@3 postcss autoprefixer -D
 npx tailwindcss init -p

npm run serve

 npm run build

npm run build
git checkout gh-pages
cp -r dist/* .
git commit -am "Deploy"
git push origin gh-pages

git add --all
git commit -m "Initial commit"
git push -u origin main

npm install
npm login   # (only once)
npm publish

cd server
npm init -y
npm i express cors google-generative-ai firebase-admin multer pdf-parse
npm i -D typescript ts-node @types/node @types/express @types/cors @types/multer
npx tsc --init

cd ../
npm i firebase
# (you already have vue-router / vite in the project)

cd server
export GOOGLE_API_KEY=YOUR_KEY
# For Firebase Admin:
# export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
npx ts-node src/index.ts

npm run dev
# open http://localhost:5173/chat (after logging in)
```
