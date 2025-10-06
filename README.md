# Capstone Project Template

This project is a template for a modern front-end capstone project.  
It satisfies all requirements described in [REQUIREMENTS.md](REQUIREMENTS.md).

---

## Table of Contents

- [Cloning the Project](#cloning-the-project)
- [Environment Preparation](#environment-preparation)
- [Installing Dependencies](#installing-dependencies)
- [Building the Project](#building-the-project)
- [Running the Project](#running-the-project)
- [Opening in Browser](#opening-in-browser)
- [Verifying the Project](#verifying-the-project)
- [Project Structure](#project-structure)
- [Requirements](#requirements)

---

## Cloning the Project

Clone the repository from the main branch:

```sh
git clone https://autocode.git.epam.com/campus_javascript/capstone-project/project-template.git
cd project-template-ua
```

---

## Environment Preparation

- **Node.js**: v18.x or higher (LTS recommended)
- **npm**: v9.x or higher (comes with Node.js)
- **Git**: for cloning the repository
- **Recommended IDE**: [Visual Studio Code](https://code.visualstudio.com/)

Check your versions:

```sh
node -v
npm -v
git --version
```

---

## Installing Dependencies

Install all required packages using npm:

```sh
npm install
```

This will install all development dependencies, including build tools, linters, and preprocessors.

---

## Building the Project

To build the project, run:

```sh
npm run build
```

**What happens during build:**

- HTML files are processed and output to `dist/` (using PostHTML).
- All assets (CSS, JS, images, fonts, etc.) are copied to `dist/`.
- SCSS files are compiled to CSS and placed in `dist/css/`.

---

## Running the Project

You can use any static server to preview the site.  
For example, with [serve](https://www.npmjs.com/package/serve):

```sh
npm install -g serve
serve dist
```

Or use the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension in VS Code.

---

## Opening in Browser

After starting the static server, open [http://localhost:3000](http://localhost:3000) (or the port shown in your terminal) in your browser.

---

## Verifying the Project

- Ensure all pages load and are styled correctly.
- Test interactivity (filters, cart, forms, etc.).
- Check responsiveness on mobile, tablet, and desktop.
- Confirm all requirements in [REQUIREMENTS.md](REQUIREMENTS.md) are satisfied.

---

## Project Structure

```
project-template-ua/
├── src/
│   ├── scss/
│   ├── js/
│   ├── assets/
│   ├── pages/
│   └── components/
├── dist/
├── package.json
├── README.md
├── REQUIREMENTS.md
└── ...
```

---

## Requirements

This project fully implements all features and criteria described in [REQUIREMENTS.md](REQUIREMENTS.md).

---
