import { execSync } from 'node:child_process';
import fs from 'node:fs';

try {
  console.log('Calculating version bump...');
  const bump = execSync('pnpm exec auto version', { encoding: 'utf8' }).trim();

  if (bump && !bump.includes('v') && !bump.includes('.')) {
    console.log(`Bumping version: ${bump}`);
    // pnpm version <bump> --no-git-tag-version 을 실행하면 package.json 의 버전이 업데이트됨
    execSync(`pnpm version ${bump} --no-git-tag-version`, { stdio: 'inherit' });

    // package.json의 최신 버전을 가져옴
    const updatedVersion = JSON.parse(fs.readFileSync('package.json', 'utf8')).version;

    console.log('Generating changelog...');
    try {
      // auto changelog --title <version> 을 사용해 정확한 버전 명시
      // --from 옵션을 사용하여 중복 생성을 방지 (마지막 태그부터 현재까지)
      let fromTag = '';
      try {
        fromTag = `--from ${execSync('git describe --tags --abbrev=0', { encoding: 'utf8' }).trim()}`;
      } catch (e) {
        console.log('No previous tags found, generating full changelog.');
      }
      execSync(`pnpm exec auto changelog --title v${updatedVersion} ${fromTag}`, { stdio: 'inherit' });
    } catch (e) {
      console.warn('Changelog generation failed:', e.message);
    }

    const status = execSync('git status --short', { encoding: 'utf8' }).trim();
    if (status) {
      console.log('Staging changes and committing...');
      execSync('git add package.json CHANGELOG.md', { stdio: 'inherit' });
      execSync(`git commit -m "chore(release): bump version to v${updatedVersion} [skip ci]"`, { stdio: 'inherit' });
    } else {
      console.log('No changes to commit.');
    }
  }

  console.log('Running auto release...');
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
    execSync(`pnpm exec auto release --use-version v${currentVersion}`, { stdio: 'inherit' });
  } catch (e) {
    console.warn('GitHub release creation failed (check your GITHUB_TOKEN permissions):', e.message);
  }

  console.log('Publishing to npm...');
  execSync('pnpm publish --no-git-checks', { stdio: 'inherit' });
} catch (error) {
  console.error('Release failed:', error.message);
  process.exit(1);
}
