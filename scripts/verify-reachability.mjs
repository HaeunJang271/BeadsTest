/**
 * 퀴즈 가중치로 9종 원석 도달 가능 여부를 검증하는 스크립트.
 * 사용: node scripts/verify-reachability.mjs
 * (빌드 전 vitest 권장 — 이 파일은 빠른 요약용)
 */
import { spawnSync } from 'node:child_process';

const result = spawnSync(
  'npx',
  ['vitest', 'run', 'src/__tests__/recommend.test.ts'],
  { stdio: 'inherit', shell: true },
);

process.exit(result.status ?? 1);
