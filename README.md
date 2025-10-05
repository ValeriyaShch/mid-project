# Project template

What shell to use?

CMD/bash/PS

Which Node to use?

1. Install PostHTML and posthtml-include
   In your project root, run:

npm install --save-dev posthtml posthtml-include

npm install --save-dev posthtml-cli
npm install --save-dev cpy-cli

npm i? instead of all packages?

(since
"scripts": {
"build:html": "posthtml src/_.html -o dist/",
"copy:assets": "npx cpy-cli \"src/\*\*/_.{css,js,svg,png,jpg,jpeg,gif,webp,ico,json,woff,woff2,ttf,eot,mp4,webm}\" \"!src/\*_/_.html\" dist/ --parents"
"build": "npm run build:html && npm run copy:assets"
}
)

npm run build

also npm run compile

hosted app is from /dist

---

Do I need:
npm install eslint --save-dev
npm install --save-dev prettier eslint-config-prettier eslint-plugin-prettier

npm run lint
npm run lint:fix
