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
