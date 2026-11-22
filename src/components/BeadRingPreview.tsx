import { useId, useMemo } from 'react';
import { STORE } from '../config/store';
import { getGemstone } from '../data/gemstones';
import type { BraceletConfig, GemstoneId } from '../types/gemstone';
import {
  BEAD_R,
  buildRingItems,
  placeRingItems,
  type PlacedRingItem,
} from '../utils/ringLayout';

interface BeadRingPreviewProps {
  readonly config: BraceletConfig;
}

/**
 * 실물 비율의 8mm 비즈 18알 SVG 팔찌 프리뷰.
 * 폭 누적 각도로 맞물림 배치 + 앤틱 실버 꽃 스페이서.
 */
export function BeadRingPreview({ config }: BeadRingPreviewProps) {
  const uid = useId().replace(/:/g, '');
  const size = 340;
  const cx = size / 2;
  const cy = size / 2;

  const items = useMemo(() => buildRingItems(config), [config]);
  const { ringR, placed } = useMemo(
    () => placeRingItems(items, cx, cy),
    [items, cx, cy],
  );

  const gemIds = useMemo(() => {
    const ids = new Set<GemstoneId>();
    for (const it of items) {
      if (it.kind === 'bead') ids.add(it.gemId);
    }
    return [...ids];
  }, [items]);

  return (
    <div className="bead-ring" aria-label="팔찌 미리보기">
      <svg viewBox={`0 0 ${size} ${size}`} width="100%" role="img">
        <title>원석 비즈 팔찌 미리보기</title>
        <defs>
          {gemIds.map((id) => (
            <GemSphereDefs key={id} id={id} uid={uid} />
          ))}
          <MetalSpacerDefs uid={uid} />
          <filter id={`${uid}-soft`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="0.35" />
          </filter>
        </defs>

        {/* 투명 우레탄줄 — 비즈 중심을 지나는 얇은 실 */}
        <circle
          cx={cx}
          cy={cy}
          r={ringR}
          fill="none"
          stroke="rgba(17,17,17,0.12)"
          strokeWidth="1.4"
        />

        {placed.map((p, i) =>
          p.item.kind === 'bead' ? (
            <GemBead key={`b-${i}`} placed={p} uid={uid} />
          ) : (
            <FlowerSpacer key={`s-${i}`} placed={p} uid={uid} />
          ),
        )}

        <text
          x={cx}
          y={cy - 8}
          textAnchor="middle"
          className="bead-ring__center-label"
          fill="var(--muted)"
          fontSize="11"
        >
          {STORE.beadMm}mm · {STORE.beadCount}알
        </text>
        <text
          x={cx}
          y={cy + 8}
          textAnchor="middle"
          fill="var(--muted)"
          fontSize="10"
        >
          {config.flowerSpacer ? '꽃 스페이서 ON · ' : ''}
          0.8mm 우레탄 1겹
        </text>
      </svg>
    </div>
  );
}

function GemSphereDefs({ id, uid }: { readonly id: GemstoneId; readonly uid: string }) {
  const gem = getGemstone(id);
  const base = gem.visual.stops;
  return (
    <>
      <radialGradient id={`${uid}-g-${id}`} cx="34%" cy="30%" r="72%">
        {base.map((s) => (
          <stop key={s.offset} offset={s.offset} stopColor={s.color} />
        ))}
      </radialGradient>
      <radialGradient id={`${uid}-shine-${id}`} cx="30%" cy="26%" r="55%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
        <stop offset="35%" stopColor="#ffffff" stopOpacity="0.12" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
      </radialGradient>
      <radialGradient id={`${uid}-shade-${id}`} cx="70%" cy="78%" r="60%">
        <stop offset="0%" stopColor="#000000" stopOpacity="0" />
        <stop offset="55%" stopColor="#000000" stopOpacity="0.08" />
        <stop offset="100%" stopColor="#000000" stopOpacity="0.28" />
      </radialGradient>
    </>
  );
}

function MetalSpacerDefs({ uid }: { readonly uid: string }) {
  return (
    <>
      <radialGradient id={`${uid}-metal`} cx="32%" cy="28%" r="70%">
        <stop offset="0%" stopColor="#F4F2EC" />
        <stop offset="28%" stopColor="#D8D4CC" />
        <stop offset="55%" stopColor="#A8A49A" />
        <stop offset="78%" stopColor="#8A8680" />
        <stop offset="100%" stopColor="#6E6A64" />
      </radialGradient>
      <linearGradient id={`${uid}-metal-rim`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#EDEAE3" />
        <stop offset="45%" stopColor="#9A968E" />
        <stop offset="100%" stopColor="#5C5852" />
      </linearGradient>
    </>
  );
}

function GemBead({
  placed,
  uid,
}: {
  readonly placed: PlacedRingItem;
  readonly uid: string;
}) {
  if (placed.item.kind !== 'bead') return null;
  const { gemId } = placed.item;
  const gem = getGemstone(gemId);
  const { x, y } = placed;
  const r = BEAD_R;

  return (
    <g>
      {/* 바닥 접촉 그림자 */}
      <ellipse
        cx={x + r * 0.08}
        cy={y + r * 0.72}
        rx={r * 0.72}
        ry={r * 0.22}
        fill="rgba(17,17,17,0.14)"
        filter={`url(#${uid}-soft)`}
      />
      <circle
        cx={x}
        cy={y}
        r={r}
        fill={`url(#${uid}-g-${gemId})`}
        stroke={gem.visual.rim}
        strokeWidth="0.7"
      />
      <circle cx={x} cy={y} r={r} fill={`url(#${uid}-shade-${gemId})`} />
      <circle cx={x} cy={y} r={r * 0.92} fill={`url(#${uid}-shine-${gemId})`} />
      {/* 스펙큘러 하이라이트 */}
      <ellipse
        cx={x - r * 0.32}
        cy={y - r * 0.38}
        rx={r * 0.26}
        ry={r * 0.16}
        fill="rgba(255,255,255,0.45)"
      />
      <ellipse
        cx={x - r * 0.12}
        cy={y - r * 0.48}
        rx={r * 0.1}
        ry={r * 0.06}
        fill="rgba(255,255,255,0.65)"
      />
    </g>
  );
}

/**
 * 실 방향에 맞춘 앤틱 실버 꽃 스페이서.
 */
function FlowerSpacer({
  placed,
  uid,
}: {
  readonly placed: PlacedRingItem;
  readonly uid: string;
}) {
  const { x, y, angleDeg } = placed;
  const petals = 6;
  const r = 5.4;

  return (
    <g transform={`translate(${x}, ${y}) rotate(${angleDeg})`}>
      {/* 실 통과용 메탈 와셔 */}
      <circle
        r={r * 0.95}
        fill={`url(#${uid}-metal)`}
        stroke={`url(#${uid}-metal-rim)`}
        strokeWidth="0.7"
      />
      {Array.from({ length: petals }, (_, i) => {
        const a = (i / petals) * Math.PI * 2;
        const px = Math.cos(a) * (r * 0.55);
        const py = Math.sin(a) * (r * 0.55);
        const deg = (a * 180) / Math.PI;
        return (
          <ellipse
            key={i}
            cx={px}
            cy={py}
            rx={r * 0.42}
            ry={r * 0.24}
            transform={`rotate(${deg} ${px} ${py})`}
            fill={`url(#${uid}-metal)`}
            stroke="#7A7670"
            strokeWidth="0.35"
          />
        );
      })}
      <circle r={r * 0.28} fill={`url(#${uid}-metal-rim)`} stroke="#5C5852" strokeWidth="0.4" />
      {/* 구멍 */}
      <circle r={r * 0.12} fill="#2A2826" />
      <circle r={r * 0.08} fill="#1A1816" />
      {/* 메탈 하이라이트 */}
      <ellipse
        cx={-r * 0.2}
        cy={-r * 0.25}
        rx={r * 0.22}
        ry={r * 0.1}
        fill="rgba(255,255,255,0.35)"
      />
    </g>
  );
}
