import { BEAD_R, FLOWER_CAP } from '../utils/ringLayout';

/**
 * 비즈 겉 윤곽을 감싸는 6mm 엔틱 실버 꽃 비즈 캡 한 쌍.
 * rotate(angleDeg+90) — 로컬 X = 실(접선).
 * 캡 끝 ±outerX(21.5)는 구슬(±16) 밖 5.5px — 옆 비즈·도넛과 비겹침 폭은 ringLayout에서 확보.
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
      <FlowerCapCup uid={uid} along={-outerX} towardCenter={1} />
      <FlowerCapCup uid={uid} along={outerX} towardCenter={-1} />
    </g>
  );
}

/**
 * 한쪽 꽃받침. 로컬 0 = 바깥 실 구멍(비즈 겉 밖).
 * 비즈 표면까지 감싸되 원 안으로 파고들지 않는 입체 실루엣.
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
  const { halfH, outerX } = FLOWER_CAP;
  // 비즈 겉면까지의 거리 (로컬): outerX - BEAD_R = 5.5
  const nest = towardCenter * (outerX - BEAD_R);
  // 겉 곡선을 타고 감싸는 꽃잎 끝 (표면 약간 안쪽 겉면, 원은 침범하지 않음)
  const rim = towardCenter * (outerX - BEAD_R + 0.8);

  return (
    <g transform={`translate(${along}, 0)`}>
      {/* 비즈 겉면과의 어두운 틈 */}
      <path
        d={[
          `M ${nest * 0.35} ${-halfH * 0.55}`,
          `Q ${rim} ${-halfH * 0.25} ${rim} 0`,
          `Q ${rim} ${halfH * 0.25} ${nest * 0.35} ${halfH * 0.55}`,
          `Q ${nest * 0.15} 0 ${nest * 0.35} ${-halfH * 0.55}`,
          `Z`,
        ].join(' ')}
        fill="rgba(0,0,0,0.22)"
      />

      {/* 본체 — 바깥 구멍에서 비즈 겉 곡선으로 붙는 꽃받침 컵 */}
      <path
        d={[
          `M 0 ${-3.2}`,
          `C ${towardCenter * 1.8} ${-halfH * 0.55}, ${nest * 0.45} ${-halfH}, ${rim} ${-halfH}`,
          `Q ${rim * 0.55 + nest * 0.45} ${-halfH * 0.5} ${nest} ${-halfH * 0.15}`,
          `L ${nest} ${halfH * 0.15}`,
          `Q ${rim * 0.55 + nest * 0.45} ${halfH * 0.5} ${rim} ${halfH}`,
          `C ${nest * 0.45} ${halfH}, ${towardCenter * 1.8} ${halfH * 0.55}, 0 ${3.2}`,
          `Z`,
        ].join(' ')}
        fill={`url(#${uid}-cap)`}
        stroke="#5A564E"
        strokeWidth="0.5"
      />

      {/* 위·아래 꽃잎 — 겉 윤곽을 따라 벌어짐 */}
      <path
        d={[
          `M 0 0`,
          `Q ${towardCenter * 2.5} ${-halfH * 0.45} ${rim} ${-halfH}`,
          `Q ${nest * 0.7} ${-halfH * 0.35} ${towardCenter * 1.5} 0`,
          `Z`,
        ].join(' ')}
        fill={`url(#${uid}-cap)`}
        stroke="#5A564E"
        strokeWidth="0.45"
      />
      <path
        d={[
          `M 0 0`,
          `Q ${towardCenter * 2.5} ${halfH * 0.45} ${rim} ${halfH}`,
          `Q ${nest * 0.7} ${halfH * 0.35} ${towardCenter * 1.5} 0`,
          `Z`,
        ].join(' ')}
        fill={`url(#${uid}-cap)`}
        stroke="#5A564E"
        strokeWidth="0.45"
      />
      {/* 좌우 보조 꽃잎 */}
      <path
        d={[
          `M 0 0`,
          `Q ${towardCenter * 3 - 2.5} ${-halfH * 0.15} ${rim * 0.85} ${-halfH * 0.55}`,
          `Q ${nest * 0.55} ${-halfH * 0.1} ${towardCenter * 1.2} 0`,
          `Z`,
        ].join(' ')}
        fill={`url(#${uid}-cap)`}
        stroke="#5A564E"
        strokeWidth="0.4"
        opacity="0.95"
      />
      <path
        d={[
          `M 0 0`,
          `Q ${towardCenter * 3 + 2.5} ${halfH * 0.15} ${rim * 0.85} ${halfH * 0.55}`,
          `Q ${nest * 0.55} ${halfH * 0.1} ${towardCenter * 1.2} 0`,
          `Z`,
        ].join(' ')}
        fill={`url(#${uid}-cap)`}
        stroke="#5A564E"
        strokeWidth="0.4"
        opacity="0.95"
      />

      {/* 바깥 메탈 목 + 실 구멍 */}
      <ellipse
        cx={towardCenter * 0.5}
        cy={0}
        rx={3.4}
        ry={4.6}
        fill={`url(#${uid}-cap-core)`}
        stroke="#4A4640"
        strokeWidth="0.5"
      />
      <ellipse
        cx={towardCenter * -0.55}
        cy={-1.8}
        rx={1.5}
        ry={1.15}
        fill="rgba(255,255,255,0.42)"
      />
      <circle cx={0} cy={0} r={1.9} fill="#2A2826" />
      <circle cx={0} cy={0} r={1.2} fill="#1A1816" />
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
