# Codeeye

🧠 AI-powered code reviewer for your staged Git changes using Google Gemini.

[![codeeye](https://img.shields.io/npm/v/codeeye)](https://npmjs.com/package/codeeye)
[![Gemini Powered](https://img.shields.io/badge/powered%20by-Gemini-blue)](https://makersuite.google.com)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

### suggestion example
![Image](https://github.com/user-attachments/assets/0cc187cc-62e8-49b9-b23c-007e52851c78)

### suggested fix example
![Image](https://github.com/user-attachments/assets/467a5880-c49e-4521-b028-1027ce02e444)


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