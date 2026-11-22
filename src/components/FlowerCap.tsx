import type { FlowerCapMetal } from '../types/gemstone';
import { BEAD_R, FLOWER_CAP } from '../utils/ringLayout';

type CapMetal = Exclude<FlowerCapMetal, 'none'>;

/**
 * 비즈 겉(r=16)에 밀착하는 6mm 꽃 비즈 캡 한 쌍 (실버/골드).
 * rotate(angleDeg+90) — 로컬 X = 실(접선).
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
  const { outerX } = FLOWER_CAP;
  return (
    <g transform={`translate(${x}, ${y}) rotate(${angleDeg + 90})`}>
      <FlowerCapCup uid={uid} metal={metal} along={-outerX} towardCenter={1} />
      <FlowerCapCup uid={uid} metal={metal} along={outerX} towardCenter={-1} />
    </g>
  );
}

/**
 * 비즈 원 윤곽에 빈틈없이 붙는 한쪽 컵.
 * 로컬 0 = 바깥 실 구멍. 비즈 중심은 towardCenter * -outerX.
 */
function FlowerCapCup({
  uid,
  metal,
  along,
  towardCenter,
}: {
  readonly uid: string;
  readonly metal: CapMetal;
  readonly along: number;
  readonly towardCenter: 1 | -1;
}) {
  const { halfH, outerX } = FLOWER_CAP;
  const grad = `${uid}-cap-${metal}`;
  const core = `${uid}-cap-core-${metal}`;

  // 비즈 중심(로컬): towardCenter 반대쪽으로 outerX
  // 겉면 접점(실 축): towardCenter * (outerX - BEAD_R) = ±5.5
  const contact = towardCenter * (outerX - BEAD_R);

  // 비즈 겉 원호 위 점들 (비즈 중심 기준 각도 → 로컬 좌표)
  // 로컬: beadCenterX = -towardCenter * outerX  (along 원점 기준)
  const cx = -towardCenter * outerX;
  const arc = (deg: number): { x: number; y: number } => {
    const rad = (deg * Math.PI) / 180;
    // towardCenter=+1(왼쪽 캡): 원의 오른쪽 반구를 감쌈 → 각도 약 -60~60 where 0 is +X from bead
    // towardCenter=-1(오른쪽 캡): 원의 왼쪽 반구
    const base = towardCenter === 1 ? 0 : Math.PI;
    return {
      x: cx + BEAD_R * Math.cos(base + rad * towardCenter),
      y: BEAD_R * Math.sin(rad),
    };
  };

  const top = arc(-58);
  const midTop = arc(-28);
  const midBot = arc(28);
  const bot = arc(58);
  // 실 축 겉면 접점
  const seam = { x: contact, y: 0 };

  return (
    <g transform={`translate(${along}, 0)`}>
      {/* 비즈 겉면 밀착 틈 */}
      <path
        d={[
          `M ${seam.x} ${-2}`,
          `Q ${midTop.x} ${midTop.y} ${top.x} ${top.y}`,
          `L ${top.x + towardCenter * 0.8} ${top.y}`,
          `Q ${midTop.x + towardCenter * 0.6} ${midTop.y} ${seam.x + towardCenter * 0.7} 0`,
          `Q ${midBot.x + towardCenter * 0.6} ${midBot.y} ${bot.x + towardCenter * 0.8} ${bot.y}`,
          `L ${bot.x} ${bot.y}`,
          `Q ${midBot.x} ${midBot.y} ${seam.x} ${2}`,
          `Z`,
        ].join(' ')}
        fill="rgba(0,0,0,0.2)"
      />

      {/* 본체 — 바깥 구멍 → 비즈 겉 원호에 밀착 */}
      <path
        d={[
          `M 0 ${-3.4}`,
          `C ${towardCenter * 2} ${-halfH * 0.5}, ${top.x * 0.35} ${top.y}, ${top.x} ${top.y}`,
          `Q ${midTop.x} ${midTop.y} ${seam.x} ${seam.y - 0.2}`,
          `L ${seam.x} ${seam.y + 0.2}`,
          `Q ${midBot.x} ${midBot.y} ${bot.x} ${bot.y}`,
          `C ${bot.x * 0.35} ${bot.y}, ${towardCenter * 2} ${halfH * 0.5}, 0 ${3.4}`,
          `Z`,
        ].join(' ')}
        fill={`url(#${grad})`}
        stroke={metal === 'gold' ? '#8A7038' : '#5A564E'}
        strokeWidth="0.5"
      />

      {/* 위·아래 꽃잎 — 겉 원호를 따라 */}
      <path
        d={`M 0 0 Q ${towardCenter * 2.2} ${-halfH * 0.4} ${top.x} ${top.y} Q ${midTop.x} ${midTop.y * 0.5} ${towardCenter * 1.4} 0 Z`}
        fill={`url(#${grad})`}
        stroke={metal === 'gold' ? '#8A7038' : '#5A564E'}
        strokeWidth="0.45"
      />
      <path
        d={`M 0 0 Q ${towardCenter * 2.2} ${halfH * 0.4} ${bot.x} ${bot.y} Q ${midBot.x} ${midBot.y * 0.5} ${towardCenter * 1.4} 0 Z`}
        fill={`url(#${grad})`}
        stroke={metal === 'gold' ? '#8A7038' : '#5A564E'}
        strokeWidth="0.45"
      />

      {/* 바깥 림 + 실 구멍 */}
      <ellipse
        cx={towardCenter * 0.45}
        cy={0}
        rx={3.3}
        ry={4.5}
        fill={`url(#${core})`}
        stroke={metal === 'gold' ? '#6E5420' : '#4A4640'}
        strokeWidth="0.5"
      />
      <ellipse
        cx={towardCenter * -0.5}
        cy={-1.7}
        rx={1.45}
        ry={1.1}
        fill="rgba(255,255,255,0.4)"
      />
      <circle cx={0} cy={0} r={1.85} fill="#2A2826" />
      <circle cx={0} cy={0} r={1.15} fill="#1A1816" />
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
