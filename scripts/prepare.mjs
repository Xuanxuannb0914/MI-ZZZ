import { existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';

const workspaceRoot = resolve(import.meta.dirname, '..');
const gitDirectory = resolve(workspaceRoot, '.git');

if (existsSync(gitDirectory)) {
  execFileSync('git', ['config', 'core.hooksPath', '.husky'], {
    cwd: workspaceRoot,
    stdio: 'inherit',
  });
} else {
  process.stdout.write('Git repository not initialized; Husky setup skipped.\n');
}
