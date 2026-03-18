import { execSync } from 'node:child_process';

try {
  console.log('Calculating version bump...');
  const bump = execSync('pnpm exec auto version', { encoding: 'utf8' }).trim();

  if (bump) {
    console.log(`Bumping version: ${bump}`);
    // Use pnpm version with the bump type/version
    execSync(`pnpm version ${bump} --no-git-tag-version`, { stdio: 'inherit' });
    execSync('git add package.json', { stdio: 'inherit' });
    try {
      execSync('pnpm exec auto changelog', { stdio: 'inherit' });
      execSync('git add CHANGELOG.md', { stdio: 'inherit' });
    } catch (e) {
      console.warn('Changelog generation skipped or failed:', e.message);
    }
    execSync(`git commit -m "Bump version to: ${bump} [skip ci]"`, { stdio: 'inherit' });
  }

  console.log('Running auto shipit...');
  execSync('pnpm exec auto shipit', { stdio: 'inherit' });
} catch (error) {
  console.error('Release failed:', error.message);
  process.exit(1);
}
