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

  console.log('Running auto shipit...');
  // 윈도우에서 인자 전달 문제를 피하기 위해, auto shipit이 직접 npm version을 호출하지 않도록
  // 최대한 이미 업데이트된 정보를 바탕으로 동작하게 유도합니다.
  // --use-version을 사용하여 auto가 npm version을 호출하는 대신 지정된 버전을 사용하도록 합니다.
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const currentVersion = packageJson.version;
  console.log(`Using version: ${currentVersion}`);

  // --only-publish 옵션은 shipit 단계에서 버전 범프와 태그 생성을 건너뛰고 바로 배포(publish)만 수행하도록 시도합니다.
  // 하지만 shipit 명령어는 --only-publish를 직접 지원하지 않을 수 있으므로,
  // 만약 여전히 npm version을 호출하려 한다면 --use-version과 조합하여 최대한 우회합니다.
  execSync(`pnpm exec auto shipit --use-version ${currentVersion}`, { stdio: 'inherit' });
} catch (error) {
  console.error('Release failed:', error.message);
  process.exit(1);
}
