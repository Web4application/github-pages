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
