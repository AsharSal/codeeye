#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const localEnvPath = path.join(process.cwd(), '.env');
if (fs.existsSync(localEnvPath)) {
  dotenv.config({ path: localEnvPath });
} else {
  console.warn('⚠️  No .env file found. Please add GOOGLE_API_KEY in .env.');
  process.exit(1);
}

const args = process.argv.slice(2);
const options = {
  isSummaryOnly: args.includes('--summary'),
  isMarkdown: args.includes('--md'),
  copyToClipboard: args.includes('--copy'),
  isFixMode: args.includes('--fix'),
};
const { runReview, runFix } = await import('./review.js');
if(options.isFixMode) {
  await runFix(options);
}
else {
  await runReview(options);
}
