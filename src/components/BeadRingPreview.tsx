import { useId, useMemo } from 'react';
import { STORE } from '../config/store';
import { getGemstone } from '../data/gemstones';
import type { BraceletConfig, CustomBrush, GemstoneId } from '../types/gemstone';
import {
  BEAD_R,
  buildRingItems,
  placeRingItems,
  type PlacedRingItem,
} from '../utils/ringLayout';
import { DonutSpacer, DonutSpacerDefs } from './DonutSpacer';
import { FlowerCapDefs, FlowerCaps } from './FlowerCap';

interface BeadRingPreviewProps {
  readonly config: BraceletConfig;
  readonly brush?: CustomBrush | null;
  readonly onPaintBead?: (index: number) => void;
}

/**
 * 실물 비율 비즈 팔찌 SVG — 도넛 스페이서 + 꽃 비즈 캡.
 */
export function BeadRingPreview({
  config,
  brush = null,
  onPaintBead,
}: BeadRingPreviewProps) {
  const uid = useId().replace(/:/g, '');
  const size = 340;
  const cx = size / 2;
  const cy = size / 2;
  const interactive = config.pattern === 'custom' && Boolean(onPaintBead);

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

  const caption = [
    `${STORE.beadMm}mm · ${STORE.beadCount}알`,
    config.donutMetal !== 'none' ? `도넛 ${config.donutMetal}` : null,
    '0.8mm 우레탄 1겹',
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <div className="bead-ring" aria-label="팔찌 미리보기">
      <svg viewBox={`0 0 ${size} ${size}`} width="100%" role="img">
        <title>원석 비즈 팔찌 미리보기</title>
        <defs>
          {gemIds.map((id) => (
            <GemSphereDefs key={id} id={id} uid={uid} />
          ))}
          <DonutSpacerDefs uid={uid} />
          <FlowerCapDefs uid={uid} />
          <filter id={`${uid}-soft`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="0.35" />
          </filter>
        </defs>

        <circle
          cx={cx}
          cy={cy}
          r={ringR}
          fill="none"
          stroke="rgba(17,17,17,0.12)"
          strokeWidth="1.4"
        />

        {placed.map((p, i) => {
          if (p.item.kind === 'donut') {
            return <DonutSpacer key={`d-${i}`} placed={p} uid={uid} />;
          }
          return (
            <GemBead
              key={`b-${i}`}
              placed={p}
              uid={uid}
              interactive={interactive}
              onPaint={onPaintBead}
            />
          );
        })}
      </svg>
      <p className="bead-ring__caption ui-label">
        {caption}
        {interactive && brush ? ' · 탭하여 칠하기' : ''}
      </p>
    </div>
  );
}

function GemSphereDefs({
  id,
  uid,
}: {
  readonly id: GemstoneId;
  readonly uid: string;
}) {
  const gem = getGemstone(id);
  return (
    <>
      <radialGradient id={`${uid}-g-${id}`} cx="34%" cy="30%" r="72%">
        {gem.visual.stops.map((s) => (
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
        <stop offset="100%" stopColor="#000000" stopOpacity="0.28" />
      </radialGradient>
    </>
  );
}

function GemBead({
  placed,
  uid,
  interactive,
  onPaint,
}: {
  readonly placed: PlacedRingItem;
  readonly uid: string;
  readonly interactive: boolean;
  readonly onPaint?: (index: number) => void;
}) {
  if (placed.item.kind !== 'bead') return null;
  const { gemId, beadIndex, flowerCap } = placed.item;
  const gem = getGemstone(gemId);
  const { x, y, angleDeg } = placed;
  const r = BEAD_R;

  return (
    <g
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={interactive ? `${beadIndex + 1}번 알` : undefined}
      style={interactive ? { cursor: 'pointer' } : undefined}
      onClick={interactive && onPaint ? () => onPaint(beadIndex) : undefined}
      onKeyDown={
        interactive && onPaint
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onPaint(beadIndex);
              }
            }
          : undefined
      }
    >
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
      <ellipse
        cx={x - r * 0.32}
        cy={y - r * 0.38}
        rx={r * 0.26}
        ry={r * 0.16}
        fill="rgba(255,255,255,0.45)"
      />
      {flowerCap !== 'none' ? (
        <FlowerCaps
          x={x}
          y={y}
          angleDeg={angleDeg}
          uid={uid}
          metal={flowerCap}
        />
      ) : null}
    </g>
  );
}
