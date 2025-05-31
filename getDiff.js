import { execSync } from 'child_process';

export function getStagedDiff() {
  try {
    const diff = execSync('git diff --cached', { encoding: 'utf-8' });
    return diff || '';
  } catch (err) {
    console.error('Error getting staged diff:', err.message);
    return '';
  }
}
