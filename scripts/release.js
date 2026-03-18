import { execSync } from 'node:child_process';
import fs from 'node:fs';

try {
  console.log('Calculating version bump...');
  const bump = execSync('pnpm exec auto version', { encoding: 'utf8' }).trim();

  if (bump && !bump.includes('v') && !bump.includes('.')) {
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
      execSync('git add package.json CHANGELOG.md scripts/release.js', { stdio: 'inherit' });
      execSync(`git commit -m "chore(release): bump version to ${bump} [skip ci]"`, { stdio: 'inherit' });
    } else {
      console.log('No changes to commit.');
    }
  }

  console.log('Running auto release...');
  // 윈도우에서 shipit/npm 플러그인이 npm version을 잘못 호출하는 문제를 피하기 위해
  // 직접 태그를 생성하고 auto release를 호출하여 GitHub 릴리즈와 배포를 진행합니다.
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const currentVersion = packageJson.version;
  const tagName = `v${currentVersion}`;

  console.log(`Creating tag ${tagName}...`);
  try {
    execSync(`git tag -a ${tagName} -m "Release ${tagName} [skip ci]"`, { stdio: 'inherit' });
    execSync(`git push origin ${tagName}`, { stdio: 'inherit' });
  } catch (e) {
    console.warn('Tag creation or push failed (it might already exist):', e.message);
  }

  console.log('Pushing commits...');
  execSync('git push origin main', { stdio: 'inherit' });

  console.log('Creating GitHub release...');
  try {
    execSync('pnpm exec auto release', { stdio: 'inherit' });
  } catch (e) {
    console.warn('GitHub release creation failed (check your GITHUB_TOKEN permissions):', e.message);
  }

  console.log('Publishing to npm...');
  execSync('pnpm publish --no-git-checks', { stdio: 'inherit' });
} catch (error) {
  console.error('Release failed:', error.message);
  process.exit(1);
}
