import { execSync } from 'node:child_process';

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
    } else {
      console.log('No changes to commit.');
    }
  }

  console.log('Running auto shipit to publish...');
  // auto shipit --only-publish 옵션을 사용하여 버전 범프와 태그 생성을 건너뜀
  execSync('pnpm exec auto shipit --only-publish', { stdio: 'inherit' });
} catch (error) {
  console.error('Release failed:', error.message);
  process.exit(1);
}
