import { execSync } from 'node:child_process';
import fs from 'node:fs';

try {
  console.log('Calculating version bump...');
  const bump = execSync('pnpm exec auto version', { encoding: 'utf8' }).trim();

  if (bump) {
    console.log(`Bumping version: ${bump}`);
    // pnpm version <bump> --no-git-tag-version 을 실행하면 package.json 의 버전이 업데이트됨
    execSync(`pnpm version ${bump} --no-git-tag-version`, { stdio: 'inherit' });

    console.log('Generating changelog...');
    try {
      execSync('pnpm exec auto changelog', { stdio: 'inherit' });
    } catch (e) {
      console.warn('Changelog generation failed:', e.message);
    }

    // 변경사항이 있는지 확인 후 커밋
    const status = execSync('git status --short', { encoding: 'utf8' }).trim();
    if (status) {
      console.log('Staging changes and committing...');
      execSync('git add package.json CHANGELOG.md', { stdio: 'inherit' });
      execSync(`git commit -m "chore(release): bump version to ${bump} [skip ci]"`, { stdio: 'inherit' });

      const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
      const newVersion = packageJson.version;
      console.log(`Creating git tag v${newVersion}...`);
      try {
        execSync(`git tag -a v${newVersion} -m "v${newVersion}"`, { stdio: 'inherit' });
      } catch (e) {
        console.warn('Tag creation failed (maybe already exists):', e.message);
      }
    } else {
      console.log('No changes to commit.');
    }
  }

  console.log('Publishing to npm...');
  execSync('pnpm publish --no-git-checks', { stdio: 'inherit' });

  console.log('Creating GitHub release...');
  execSync('pnpm exec auto release', { stdio: 'inherit' });

  console.log('Pushing changes to GitHub...');
  execSync('git push origin main --tags', { stdio: 'inherit' });
} catch (error) {
  console.error('Release failed:', error.message);
  process.exit(1);
}
