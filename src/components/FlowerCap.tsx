import { BEAD_R } from '../utils/ringLayout';

/**
 * 원석 앞뒤를 감싸는 6mm 엔틱 실버 꽃 비즈 캡 한 쌍.
 */
export function FlowerCaps({
  x,
  y,
  angleDeg,
  uid,
}: {
  readonly x: number;
  readonly y: number;
  readonly angleDeg: number;
  readonly uid: string;
}) {
  const offset = BEAD_R * 0.78;
  return (
    <g transform={`translate(${x}, ${y}) rotate(${angleDeg})`}>
      <FlowerCapHalf uid={uid} along={-offset} flip={false} />
      <FlowerCapHalf uid={uid} along={offset} flip={true} />
    </g>
  );
}

function FlowerCapHalf({
  uid,
  along,
  flip,
}: {
  readonly uid: string;
  readonly along: number;
  readonly flip: boolean;
}) {
  const s = flip ? -1 : 1;
  // 비즈 곡면을 안쪽으로 감싸는 3갈래 꽃잎
  const petals = [
    { dx: 0, dy: -4.2, rot: 0 },
    { dx: -3.2, dy: 2.2, rot: -55 },
    { dx: 3.2, dy: 2.2, rot: 55 },
  ];
  return (
    <g transform={`translate(${along}, 0) scale(${s}, 1)`}>
      {petals.map((p, i) => (
        <path
          key={i}
          d={`M 0 0
             Q ${p.dx * 0.4} ${p.dy * 0.35} ${p.dx} ${p.dy}
             Q ${p.dx * 0.55} ${p.dy * 0.55} 0 1.2
             Z`}
          transform={`rotate(${p.rot})`}
          fill={`url(#${uid}-cap)`}
          stroke="#5A564E"
          strokeWidth="0.5"
        />
      ))}
      {/* 비즈와 맞닿는 어두운 틈 */}
      <ellipse
        cx={1.1}
        cy={0}
        rx={1.2}
        ry={5.2}
        fill="rgba(0,0,0,0.22)"
      />
      <circle r={1.6} fill={`url(#${uid}-cap-core)`} stroke="#4A4640" strokeWidth="0.4" />
    </g>
  );
}

/** 꽃 캡 메탈 defs */
export function FlowerCapDefs({ uid }: { readonly uid: string }) {
  return (
    <>
      <radialGradient id={`${uid}-cap`} cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#F0ECE4" />
        <stop offset="45%" stopColor="#B8B2A6" />
        <stop offset="100%" stopColor="#6E6A62" />
      </radialGradient>
      <radialGradient id={`${uid}-cap-core`} cx="40%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#E8E4DC" />
        <stop offset="100%" stopColor="#7A766E" />
      </radialGradient>
    </>
  );
}
