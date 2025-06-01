import { getStagedDiff } from './getDiff.js';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import clipboard from 'clipboardy';

import { reviewCode, fixCode } from './services/gemini.js';
import { formatFeedback, applyFixesFromOutput } from "./utils/helper.js";

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

export async function runReview(options) {
  const diff = getStagedDiff();

  if (!diff.trim()) {
    console.log(chalk.green('✅ No staged changes found to review.'));
    return;
  }

  const spinner = ora(chalk.cyan('🔍 Reviewing staged changes with AI...')).start();

  try {
    const feedback = await reviewCode(diff,userConfig,options.isSummaryOnly);
    spinner.succeed(chalk.green('✅ Review complete!\n'));

    const divider = chalk.gray('─────────────────────────────────────────────');

    console.log('\n' + divider);
    console.log(
      chalk.bold.cyanBright(
        options.isSummaryOnly
          ? '📋 Executive Summary'
          : options.isMarkdown
          ? '📋 AI Code Review (Markdown Output)'
          : '📋 AI Code Review Suggestions'
      )
    );
    console.log(divider + '\n');

    const output = formatFeedback(feedback,options.isMarkdown);
    console.log(output);
    console.log('\n' + divider + '\n');

    if (options.copyToClipboard) {
      clipboard.writeSync(feedback);
      console.log(chalk.green('📋 Copied raw output to clipboard.'));
    }
  } catch (err) {
    spinner.fail(chalk.red('❌ Failed to complete code review.'));
    console.error(chalk.red(err.message));
    console.error(err);
  }
}

export async function runFix(options){

  const diff = getStagedDiff();

  if (!diff.trim()) {
    console.log(chalk.green('✅ No staged changes found to review.'));
    return;
  }

  const spinner = ora(chalk.cyan('🔍 Reviewing staged changes with AI...')).start();

  spinner.start('Running AI-powered code fixer...');
  const fixedOutput = await fixCode(diff);

  spinner.succeed('Fixes generated!');
  console.log(chalk.green('✍️ Applying AI fixes...\n'));

  await applyFixesFromOutput(fixedOutput,options.copyToClipboard); // We’ll write this next
  return;
}