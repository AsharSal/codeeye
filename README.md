# Codeeye

🧠 AI-powered code reviewer for your staged Git changes using Google Gemini.

![Image](https://raw.githubusercontent.com/AsharSal/codeeye/refs/heads/main/screenshots/codeeye.png)

## 📦 Install

```bash
npm i -g codeeye
```

## Usuage

- Navigate to desired repo and staged your changes. After that run the command to review the staged changes:

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