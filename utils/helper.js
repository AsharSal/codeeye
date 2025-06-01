import chalk from 'chalk';
import clipboard from 'clipboardy';
import path from 'path';


export async function applyFixesFromOutput(output,copyToClipboard) {
  let allFixes = '';
  const fileBlocks = output.split(/File:\s*(.+)/g).slice(1);

  if (fileBlocks.length === 0) {
    console.log(chalk.yellow('⚠️ No fix suggestions found in Gemini output.'));
    return;
  }

  for (let i = 0; i < fileBlocks.length; i += 2) {
    let filePath = fileBlocks[i].trim();
    const codeBlock = fileBlocks[i + 1];

    const match = codeBlock.match(/```[a-z]*\n([\s\S]*?)```/);
    if (!match) {
      console.warn(chalk.yellow(`⚠️  Skipping file: ${filePath}, no valid code block found.`));
      continue;
    }

    const suggestedCode = match[1];

    // 🧼 Strip duplicated prefixes like "backend/"
    const cwdFolderName = path.basename(process.cwd());
    if (filePath.startsWith(`${cwdFolderName}/`)) {
      filePath = filePath.replace(`${cwdFolderName}/`, '');
    }

    console.log(chalk.bold.cyan(`\n📄 Suggested Fix: ${filePath}\n`));
    console.log(chalk.gray('--- Begin Suggested Code ---\n'));
    console.log(chalk.green(suggestedCode.trim()));
    console.log(chalk.gray('\n--- End Suggested Code ---\n'));
    const fixOutput = `📄 File: ${filePath}\n\n${suggestedCode.trim()}\n\n`;
    allFixes += fixOutput + '\n';
  }
  if (copyToClipboard && allFixes.trim()) {
    clipboard.writeSync(allFixes);
    console.log(chalk.white('📋 Copied all suggestions to clipboard.'));
  }
}

export function formatFeedback(feedback,isMarkdown) {
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
      if (line.startsWith('- Suggestion:')) return chalk.green('  ' + line);
      return chalk.cyan(line);
    })
    .join('\n');
}