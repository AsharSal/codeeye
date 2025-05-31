#!/usr/bin/env node

import { GoogleGenAI } from '@google/genai';
import { getStagedDiff } from './getDiff.js';
import chalk from 'chalk';
import ora from 'ora';
import clipboard from 'clipboardy';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

const localEnvPath = path.join(process.cwd(), '.env');


if (fs.existsSync(localEnvPath)) {
  dotenv.config({ path: localEnvPath });
}
else {
  console.warn('⚠️  No .env file found. Please add GOOGLE_API_KEY in .env.');
  process.exit(1);
}

// CLI args
const args = process.argv.slice(2);
const isSummaryOnly = args.includes('--summary');
const isMarkdown = args.includes('--md');
const copyToClipboard = args.includes('--copy');

// Load .ai-reviewrc if present
function loadConfig() {
  const localConfigPath = path.join(process.cwd(), '.ai-reviewrc');
  if (fs.existsSync(localConfigPath)) {
    try {
      const config = JSON.parse(fs.readFileSync(localConfigPath, 'utf-8'));
      return config;
    } catch (err) {
      console.warn(chalk.yellow('⚠️ Failed to parse .ai-reviewrc'));
    }
  }
  return {};
}

const userConfig = loadConfig();

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

async function reviewCode(diffText) {
  const basePrompt = isSummaryOnly
    ? `
You are a senior engineer. Provide a high-level executive summary of the following code changes:
- Mention purpose of the changes.
- Highlight any potential risks, bugs, or architectural concerns.
- Keep it short and professional.

--- START DIFF ---
${diffText}
--- END DIFF ---
`
    : `
You are a strict and experienced code reviewer.

Analyze the following Git diff and provide actionable, inline suggestions.

🔍 What to include:
- Logical bugs, anti-patterns
- Performance, readability, and style improvements
- Missing error handling or validations
- Test or documentation gaps

✍️ Format (unless --summary is passed):

File: <relative/path.js>, Line: <number>
- Suggestion: <clear improvement>

User preferences:
- Tone: ${userConfig.tone || 'professional'}
- Strictness: ${userConfig.strictness || 'high'}

--- START DIFF ---
${diffText}
--- END DIFF ---
`;

  const result = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: [{ role: 'user', parts: [{ text: basePrompt }] }]
  });

  return result.text;
}

function formatFeedback(feedback) {
  if (isMarkdown) {
    return (
      '### 🤖 AI Code Review Suggestions\n\n' +
      feedback
        .split('\n')
        .map(line => {
          if (line.startsWith('File:')) return `**${line}**`;
          if (line.startsWith('- Suggestion:')) return `> ${line}`;
          return line;
        })
        .join('\n')
    );
  }

  return feedback
    .split('\n')
    .map(line => {
      if (line.startsWith('File:')) return chalk.yellow.bold(line);
      if (line.startsWith('- Suggestion:')) return chalk.white('  ' + line);
      return chalk.gray(line);
    })
    .join('\n');
}

async function runReview() {
  const diff = getStagedDiff();

  if (!diff.trim()) {
    console.log(chalk.green('✅ No staged changes found to review.'));
    return;
  }

  const spinner = ora(chalk.cyan('🔍 Reviewing staged changes with AI...')).start();

  try {
    const feedback = await reviewCode(diff);
    spinner.succeed(chalk.green('✅ Review complete!\n'));

    const divider = chalk.gray('─────────────────────────────────────────────');

    console.log('\n' + divider);
    console.log(
      chalk.bold.cyanBright(
        isSummaryOnly
          ? '📋 Executive Summary'
          : isMarkdown
          ? '📋 AI Code Review (Markdown Output)'
          : '📋 AI Code Review Suggestions'
      )
    );
    console.log(divider + '\n');

    const output = formatFeedback(feedback);
    console.log(output);
    console.log('\n' + divider + '\n');

    if (copyToClipboard) {
      clipboard.writeSync(feedback);
      console.log(chalk.green('📋 Copied raw output to clipboard.'));
    }
  } catch (err) {
    spinner.fail(chalk.red('❌ Failed to complete code review.'));
    console.error(chalk.red(err.message));
  }
}

runReview();

