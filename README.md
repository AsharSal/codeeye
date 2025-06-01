# Codeeye

🧠 **AI-powered code reviewer** for your **staged Git changes** using **Google Gemini**.

[![codeeye](https://img.shields.io/npm/v/codeeye)](https://npmjs.com/package/codeeye)
[![Gemini Powered](https://img.shields.io/badge/powered%20by-Gemini-blue)](https://makersuite.google.com)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)


## 🚀 What is Codeeye?

**Codeeye** is an open-source **JavaScript/Node.js** package published on **NPM** that uses **AI** to review your Git staged changes.

It leverages **Google Gemini** to provide smart suggestions, summaries, and markdown outputs—perfect for improving pull request quality and automating code reviews.

---

### 🔍 Features

- 🌟 NPM installable CLI tool
- 🤖 AI-powered code feedback using Gemini
- 📝 Markdown output for PR comments
- 📋 Clipboard copy support
- 📄 Summary-only mode

---

### suggestion example
![Image](https://res.cloudinary.com/djnvd9axl/image/upload/v1748796387/codeeye_axhnay.png)

### suggested fix example
![Image](https://res.cloudinary.com/djnvd9axl/image/upload/v1748796387/image_yqyfed.png)


### 📦 Install Locally


```bash
npm install codeeye
```
- if you want to install this package locally you need to use codeye command with npx

```bash

npx codeeye
npx codeeye --summary
npx codeeye --md
npx codeeye --copy
npx codeeye --fix

```

## 📦 Install Globally (Preferred)

```bash
npm i -g codeeye
```

## Usuage

- Navigate to desired repo
- create or modify existing .env file and add "GOOGLE_API_KEY" variable with gemini api key
- Stage you changes with git add .
- Run the command below to review the staged changes using AI

```bash
codeeye
```
- Get a summary only:

```bash
codeeye --summary
```
- Output in Markdown (for GitHub PR bots):

```bash
codeeye --md
```

- Copy suggestions to clipboard:

```bash
codeeye --copy
```

- Fix staged changes:

```bash
codeeye --fix
```