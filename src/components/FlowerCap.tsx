import type { FlowerCapMetal } from '../types/gemstone';

type CapMetal = Exclude<FlowerCapMetal, 'none'>;

/** r=16 원석 표면에 밀착 — 바깥·꽃잎 끝을 더 둥글게 */
const CAP_HALF_PATH = [
  'M -20.4 0',
  'C -20.4 -2.8, -19.6 -4.2, -18.2 -4.8',
  'C -16.2 -5.6, -15.0 -7.2, -13.2 -9.4',
  'Q -11.6 -11.2, -10.2 -12.2',
  'Q -9.2 -12.8, -8.8 -11.6',
  'Q -10.8 -8.8, -11.6 -6.8',
  'Q -9.6 -5.6, -8.4 -4.6',
  'Q -10.4 -3.2, -11.0 -2.0',
  'Q -8.6 -1.0, -7.4 0',
  'Q -8.6 1.0, -11.0 2.0',
  'Q -10.4 3.2, -8.4 4.6',
  'Q -9.6 5.6, -11.6 6.8',
  'Q -10.8 8.8, -8.8 11.6',
  'Q -9.2 12.8, -10.2 12.2',
  'Q -11.6 11.2, -13.2 9.4',
  'C -15.0 7.2, -16.2 5.6, -18.2 4.8',
  'C -19.6 4.2, -20.4 2.8, -20.4 0',
  'Z',
].join(' ');

/**
 * 비즈 중심 고정 좌표 꽃 캡 — Half + scale(-1,1) 대칭.
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

  return (
    <g>
      <path
        d={CAP_HALF_PATH}
        fill="rgba(0,0,0,0.18)"
        transform="translate(-0.45, 0.35)"
      />
      <path d={CAP_HALF_PATH} fill={grad} stroke={stroke} strokeWidth="0.5" />

      {/* 꽃잎 주름선 (x=-19 → 끝) */}
      <path
        d="M -19 -1.2 Q -14.5 -6.5, -10.2 -11.2"
        fill="none"
        stroke={strokeDark}
        strokeWidth="0.45"
        opacity="0.55"
      />
      <path
        d="M -19 0 Q -13.5 0, -8.5 0"
        fill="none"
        stroke={strokeDark}
        strokeWidth="0.4"
        opacity="0.4"
      />
      <path
        d="M -19 1.2 Q -14.5 6.5, -10.2 11.2"
        fill="none"
        stroke={strokeDark}
        strokeWidth="0.45"
        opacity="0.55"
      />

      {/* 바깥 림 — 더 둥근 캡슐 */}
      <ellipse
        cx={-19.4}
        cy={0}
        rx={2.1}
        ry={3.4}
        fill={core}
        stroke={strokeDark}
        strokeWidth="0.45"
      />
      <ellipse
        cx={-19.9}
        cy={-1.2}
        rx={0.85}
        ry={1.2}
        fill="rgba(255,255,255,0.35)"
      />
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
