import type { FlowerCapMetal } from '../types/gemstone';

type CapMetal = Exclude<FlowerCapMetal, 'none'>;

/**
 * 비즈 중심(0,0) 기준 고정 좌표 꽃 캡.
 * 왼쪽 반을 그리고 scale(-1,1)로 실 방향 좌우 대칭 — 삼각함수 부호 반전 버그 제거.
 */
export function FlowerCaps({
  x,
  y,
  angleDeg,
  uid,
  metal,
}: {
  readonly x: number;
  readonly y: number;
  readonly angleDeg: number;
  readonly uid: string;
  readonly metal: CapMetal;
}) {
  return (
    <g transform={`translate(${x}, ${y}) rotate(${angleDeg + 90})`}>
      <FlowerCapHalf uid={uid} metal={metal} />
      <g transform="scale(-1, 1)">
        <FlowerCapHalf uid={uid} metal={metal} />
      </g>
    </g>
  );
}

/**
 * 왼쪽 캡 반쪽 (x ≈ -20.2 ~ -7.2).
 * r=16 비즈 겉면을 바깥에서 안쪽(+X)으로 감싸는 꽃받침 실루엣.
 */
function FlowerCapHalf({
  uid,
  metal,
}: {
  readonly uid: string;
  readonly metal: CapMetal;
}) {
  const stroke = metal === 'gold' ? '#8A7038' : '#5A564E';
  const strokeDark = metal === 'gold' ? '#6E5420' : '#4A4640';
  const grad = `url(#${uid}-cap-${metal})`;
  const core = `url(#${uid}-cap-core-${metal})`;

  // 본체: 바깥 실구멍(-20.2) → 비즈 겉(-16 부근) → 안쪽 감쌈(-7.2)
  const bodyPath = [
    'M -20.2 -3.4',
    'C -19.6 -11.2, -17.8 -13.5, -15.2 -13.4',
    'Q -12.4 -12.2, -10.2 -9.6',
    'Q -8.2 -6.8, -7.2 -3.2',
    'L -7.2 3.2',
    'Q -8.2 6.8, -10.2 9.6',
    'Q -12.4 12.2, -15.2 13.4',
    'C -17.8 13.5, -19.6 11.2, -20.2 3.4',
    'Z',
  ].join(' ');

  // 비즈 겉면 밀착 그림자 (본체보다 살짝 바깥·얇게)
  const shadowPath = [
    'M -16.4 -11.8',
    'Q -12.8 -10.5, -10.4 -7.2',
    'Q -8.4 -4.2, -7.6 -1.2',
    'L -7.6 1.2',
    'Q -8.4 4.2, -10.4 7.2',
    'Q -12.8 10.5, -16.4 11.8',
    'Q -15.2 6.5, -15.0 0',
    'Q -15.2 -6.5, -16.4 -11.8',
    'Z',
  ].join(' ');

  return (
    <g>
      <path d={shadowPath} fill="rgba(0,0,0,0.18)" />

      <path d={bodyPath} fill={grad} stroke={stroke} strokeWidth="0.5" />

      {/* 위 꽃잎 — 겉면(-16)에서 안쪽(-7.2)으로 */}
      <path
        d={[
          'M -19.2 0',
          'Q -17.5 -8.5, -14.8 -12.8',
          'Q -11.5 -11.2, -8.8 -7.5',
          'Q -7.5 -4.0, -7.4 -1.0',
          'Q -10.5 -3.5, -14.0 -2.2',
          'Q -17.0 -1.2, -19.2 0',
          'Z',
        ].join(' ')}
        fill={grad}
        stroke={stroke}
        strokeWidth="0.45"
      />

      {/* 아래 꽃잎 */}
      <path
        d={[
          'M -19.2 0',
          'Q -17.5 8.5, -14.8 12.8',
          'Q -11.5 11.2, -8.8 7.5',
          'Q -7.5 4.0, -7.4 1.0',
          'Q -10.5 3.5, -14.0 2.2',
          'Q -17.0 1.2, -19.2 0',
          'Z',
        ].join(' ')}
        fill={grad}
        stroke={stroke}
        strokeWidth="0.45"
      />

      {/* 중앙 보조 꽃잎 */}
      <path
        d={[
          'M -19.6 0',
          'Q -16.5 -5.5, -12.5 -6.8',
          'Q -9.5 -5.2, -7.8 -1.8',
          'L -7.8 1.8',
          'Q -9.5 5.2, -12.5 6.8',
          'Q -16.5 5.5, -19.6 0',
          'Z',
        ].join(' ')}
        fill={grad}
        stroke={stroke}
        strokeWidth="0.4"
        opacity="0.92"
      />

      {/* 바깥 메탈 목 + 실 구멍 (−20.2) */}
      <ellipse
        cx={-20.0}
        cy={0}
        rx={3.2}
        ry={4.4}
        fill={core}
        stroke={strokeDark}
        strokeWidth="0.5"
      />
      <ellipse
        cx={-20.6}
        cy={-1.6}
        rx={1.35}
        ry={1.05}
        fill="rgba(255,255,255,0.4)"
      />
      <circle cx={-20.2} cy={0} r={1.85} fill="#2A2826" />
      <circle cx={-20.2} cy={0} r={1.15} fill="#1A1816" />
    </g>
  );
}

/** 실버/골드 꽃 캡 그라데이션 */
export function FlowerCapDefs({ uid }: { readonly uid: string }) {
  return (
    <>
      <radialGradient id={`${uid}-cap-silver`} cx="30%" cy="28%" r="75%">
        <stop offset="0%" stopColor="#F6F2EA" />
        <stop offset="35%" stopColor="#C8C2B6" />
        <stop offset="70%" stopColor="#8E887C" />
        <stop offset="100%" stopColor="#524E46" />
      </radialGradient>
      <radialGradient id={`${uid}-cap-core-silver`} cx="40%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#EFEBE3" />
        <stop offset="55%" stopColor="#A6A094" />
        <stop offset="100%" stopColor="#5E5A52" />
      </radialGradient>
      <radialGradient id={`${uid}-cap-gold`} cx="30%" cy="28%" r="75%">
        <stop offset="0%" stopColor="#F3E6C4" />
        <stop offset="35%" stopColor="#D4B56A" />
        <stop offset="70%" stopColor="#B08A3C" />
        <stop offset="100%" stopColor="#6E5420" />
      </radialGradient>
      <radialGradient id={`${uid}-cap-core-gold`} cx="40%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#F0E0B0" />
        <stop offset="55%" stopColor="#C4A050" />
        <stop offset="100%" stopColor="#7A5C22" />
      </radialGradient>
    </>
  );
}
