import type { PlacedRingItem } from '../utils/ringLayout';

/**
 * 알 사이 납작 메탈 도넛 스페이서 (실에 수직 캡슐).
 */
export function DonutSpacer({
  placed,
  uid,
}: {
  readonly placed: PlacedRingItem;
  readonly uid: string;
}) {
  if (placed.item.kind !== 'donut') return null;
  const { x, y, angleDeg } = placed;
  const metal = placed.item.metal;
  const grad = `${uid}-donut-${metal}`;
  // 폭 5.5 · 높이 ~15 캡슐, 실 방향에 수직 → 접선 정렬 후 90°
  return (
    <g transform={`translate(${x}, ${y}) rotate(${angleDeg + 90})`}>
      <ellipse
        cx={0}
        cy={0}
        rx={2.75}
        ry={7.5}
        fill={`url(#${grad})`}
        stroke={metal === 'gold' ? '#8A7038' : '#6A6862'}
        strokeWidth="0.55"
      />
      <ellipse
        cx={-0.7}
        cy={-2.2}
        rx={0.7}
        ry={2.4}
        fill="rgba(255,255,255,0.45)"
      />
      <ellipse
        cx={0.9}
        cy={2.8}
        rx={0.55}
        ry={1.8}
        fill="rgba(0,0,0,0.18)"
      />
    </g>
  );
}

/** 실버/골드 3단 메탈 그라데이션 */
export function DonutSpacerDefs({ uid }: { readonly uid: string }) {
  return (
    <>
      <linearGradient id={`${uid}-donut-silver`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F5F3EE" />
        <stop offset="35%" stopColor="#C8C4BC" />
        <stop offset="70%" stopColor="#9A968E" />
        <stop offset="100%" stopColor="#5E5A54" />
      </linearGradient>
      <linearGradient id={`${uid}-donut-gold`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F3E6C4" />
        <stop offset="35%" stopColor="#D4B56A" />
        <stop offset="70%" stopColor="#B08A3C" />
        <stop offset="100%" stopColor="#6E5420" />
      </linearGradient>
    </>
  );
}
