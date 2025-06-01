# Codeeye

🧠 AI-powered code reviewer for your staged Git changes using Google Gemini.

[![codeeye](https://img.shields.io/npm/v/codeeye)](https://npmjs.com/package/codeeye)
[![Gemini Powered](https://img.shields.io/badge/powered%20by-Gemini-blue)](https://makersuite.google.com)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)


![Image](https://raw.githubusercontent.com/AsharSal/codeeye/refs/heads/main/screenshots/codeeye.png)

## 📦 Install

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