import { BEAD_R, FLOWER_CAP } from '../utils/ringLayout';

/**
 * 비즈 겉(외곽)을 감싸는 6mm 엔틱 실버 꽃 비즈 캡 한 쌍.
 * 로컬 X = 실(접선) 방향 — rotate(angleDeg + 90).
 * 캡은 비즈 원(r=16) 밖(±outerX)에서 시작해 겉면 곡선을 따라 씌워진다.
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
  const { outerX } = FLOWER_CAP;
  return (
    <g transform={`translate(${x}, ${y}) rotate(${angleDeg + 90})`}>
      {/* −X / +X 연결부 — 비즈 바깥에서 겉을 감싸는 컵 */}
      <FlowerCapCup uid={uid} along={-outerX} towardCenter={1} />
      <FlowerCapCup uid={uid} along={outerX} towardCenter={-1} />
    </g>
  );
}

/**
 * 한쪽 외곽 컵. along = 비즈 밖 실 구멍 위치.
 * towardCenter = 비즈 중심 방향(+1 또는 -1).
 */
function FlowerCapCup({
  uid,
  along,
  towardCenter,
}: {
  readonly uid: string;
  readonly along: number;
  readonly towardCenter: 1 | -1;
}) {
  const { halfH, wrap } = FLOWER_CAP;
  // 로컬 0 = 바깥 실 구멍. 비즈 표면은 중심 쪽으로 (BEAD_R 거리)
  // along=±18.5 이면 비즈 표면은 로컬 x ≈ towardCenter * (18.5 - 16) = towardCenter * 2.5
  const surface = towardCenter * (Math.abs(along) - BEAD_R);
  const tip = towardCenter * wrap; // 겉을 따라 감싸 들어오는 꽃잎 끝

  // 왕관/꽃받침: 바깥 구멍에서 시작해 비즈 겉 곡선을 타고 Y로 벌어짐
  const petals: readonly { y: number; midY: number; lean: number }[] = [
    { y: -halfH, midY: -halfH * 0.55, lean: 0 },
    { y: -halfH * 0.35, midY: -halfH * 0.15, lean: -1 },
    { y: halfH * 0.35, midY: halfH * 0.15, lean: 1 },
    { y: halfH, midY: halfH * 0.55, lean: 0 },
    { y: 0, midY: 0, lean: 0 },
  ];

  return (
    <g transform={`translate(${along}, 0)`}>
      {/* 비즈 겉과 캡 사이 어두운 틈 */}
      <ellipse
        cx={surface * 0.55}
        cy={0}
        rx={Math.abs(surface) * 0.7 + 1.2}
        ry={halfH * 0.92}
        fill="rgba(0,0,0,0.2)"
      />

      {/* 겉면 컵 본체 — 바깥 끝 → 비즈 겉 곡선 */}
      <path
        d={[
          `M 0 ${-halfH * 0.2}`,
          `C ${towardCenter * 2} ${-halfH * 0.85}, ${surface * 0.4} ${-halfH}, ${tip} ${-halfH}`,
          `Q ${surface * 0.9} ${-halfH * 0.35} ${surface} 0`,
          `Q ${surface * 0.9} ${halfH * 0.35} ${tip} ${halfH}`,
          `C ${surface * 0.4} ${halfH}, ${towardCenter * 2} ${halfH * 0.85}, 0 ${halfH * 0.2}`,
          `Z`,
        ].join(' ')}
        fill={`url(#${uid}-cap)`}
        stroke="#5A564E"
        strokeWidth="0.5"
      />

      {/* 꽃잎 갈래 — 겉에서 비즈를 덮는 왕관 */}
      {petals.map((p, i) => (
        <path
          key={i}
          d={[
            `M 0 0`,
            `Q ${towardCenter * 2.5 + p.lean * 2} ${p.midY} ${tip + p.lean * 1.2} ${p.y}`,
            `Q ${surface * 0.65} ${p.y * 0.4} ${towardCenter * 1.2} 0`,
            `Z`,
          ].join(' ')}
          fill={`url(#${uid}-cap)`}
          stroke="#5A564E"
          strokeWidth="0.45"
          opacity={i === 4 ? 0.85 : 1}
        />
      ))}

      {/* 바깥 메탈 림 + 실 구멍 */}
      <ellipse
        cx={towardCenter * 0.6}
        cy={0}
        rx={3.2}
        ry={4.2}
        fill={`url(#${uid}-cap-core)`}
        stroke="#4A4640"
        strokeWidth="0.5"
      />
      <ellipse
        cx={towardCenter * -0.4}
        cy={-1.6}
        rx={1.4}
        ry={1.1}
        fill="rgba(255,255,255,0.4)"
      />
      <circle cx={0} cy={0} r={1.85} fill="#2A2826" />
      <circle cx={0} cy={0} r={1.15} fill="#1A1816" />
    </g>
  );
}

/** 꽃 캡 메탈 defs */
export function FlowerCapDefs({ uid }: { readonly uid: string }) {
  return (
    <>
      <radialGradient id={`${uid}-cap`} cx="30%" cy="28%" r="75%">
        <stop offset="0%" stopColor="#F6F2EA" />
        <stop offset="35%" stopColor="#C8C2B6" />
        <stop offset="70%" stopColor="#8E887C" />
        <stop offset="100%" stopColor="#524E46" />
      </radialGradient>
      <radialGradient id={`${uid}-cap-core`} cx="40%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#EFEBE3" />
        <stop offset="55%" stopColor="#A6A094" />
        <stop offset="100%" stopColor="#5E5A52" />
      </radialGradient>
    </>
  );
}
