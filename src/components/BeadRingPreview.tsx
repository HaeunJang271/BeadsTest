import { useMemo } from 'react';
import { STORE } from '../config/store';
import { getGemstone } from '../data/gemstones';
import { buildBeadSequence } from '../logic/recommend';
import type { BraceletConfig, GemstoneId } from '../types/gemstone';

interface BeadRingPreviewProps {
  readonly config: BraceletConfig;
}

/**
 * 8mm 비즈 18알 원형 SVG 프리뷰.
 * 원석별 radialGradient + 6mm 꽃 스페이서 ON/OFF.
 */
export function BeadRingPreview({ config }: BeadRingPreviewProps) {
  const sequence = useMemo(() => buildBeadSequence(config), [config]);
  const size = 320;
  const cx = size / 2;
  const cy = size / 2;
  const ringR = 108;
  const beadR = 14; // 8mm 비율 표현
  const flowerR = 10.5; // 6mm 비율
  const uniqueIds = useMemo(() => [...new Set(sequence)], [sequence]);

  return (
    <div className="bead-ring" aria-label="팔찌 미리보기">
      <svg viewBox={`0 0 ${size} ${size}`} width="100%" role="img">
        <title>원석 비즈 팔찌 미리보기</title>
        <defs>
          {uniqueIds.map((id) => (
            <GemGradient key={id} id={id} />
          ))}
          <radialGradient id="flower-grad" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="55%" stopColor="#F0EEE8" />
            <stop offset="100%" stopColor="#C8C4BA" />
          </radialGradient>
        </defs>

        {/* 투명 우레탄줄 */}
        <circle
          cx={cx}
          cy={cy}
          r={ringR}
          fill="none"
          stroke="rgba(17,17,17,0.18)"
          strokeWidth="1.2"
        />

        {sequence.map((gemId, i) => {
          const angle = (i / sequence.length) * Math.PI * 2 - Math.PI / 2;
          const x = cx + Math.cos(angle) * ringR;
          const y = cy + Math.sin(angle) * ringR;
          return (
            <g key={`bead-${i}`}>
              <circle
                cx={x}
                cy={y}
                r={beadR}
                fill={`url(#grad-${gemId})`}
                stroke={getGemstone(gemId).visual.rim}
                strokeWidth="0.8"
              />
              <ellipse
                cx={x - beadR * 0.28}
                cy={y - beadR * 0.32}
                rx={beadR * 0.28}
                ry={beadR * 0.18}
                fill="rgba(255,255,255,0.22)"
              />
              {config.flowerSpacer && i % 3 === 2 ? (
                <FlowerSpacer
                  x={cx + Math.cos(angle + Math.PI / sequence.length) * (ringR - 1)}
                  y={cy + Math.sin(angle + Math.PI / sequence.length) * (ringR - 1)}
                  r={flowerR}
                />
              ) : null}
            </g>
          );
        })}

        <text
          x={cx}
          y={cy - 6}
          textAnchor="middle"
          className="bead-ring__center-label"
          fill="var(--muted)"
          fontSize="11"
        >
          {STORE.beadMm}mm · {STORE.beadCount}알
        </text>
        <text
          x={cx}
          y={cy + 10}
          textAnchor="middle"
          fill="var(--muted)"
          fontSize="10"
        >
          0.8mm 우레탄 1겹
        </text>
      </svg>
    </div>
  );
}

function GemGradient({ id }: { readonly id: GemstoneId }) {
  const gem = getGemstone(id);
  return (
    <radialGradient id={`grad-${id}`} cx="32%" cy="28%" r="70%">
      {gem.visual.stops.map((s) => (
        <stop key={s.offset} offset={s.offset} stopColor={s.color} />
      ))}
    </radialGradient>
  );
}

function FlowerSpacer({
  x,
  y,
  r,
}: {
  readonly x: number;
  readonly y: number;
  readonly r: number;
}) {
  const petals = 5;
  return (
    <g transform={`translate(${x}, ${y})`} opacity="0.92">
      {Array.from({ length: petals }, (_, i) => {
        const a = (i / petals) * Math.PI * 2 - Math.PI / 2;
        const px = Math.cos(a) * (r * 0.45);
        const py = Math.sin(a) * (r * 0.45);
        return (
          <ellipse
            key={i}
            cx={px}
            cy={py}
            rx={r * 0.38}
            ry={r * 0.22}
            transform={`rotate(${(a * 180) / Math.PI} ${px} ${py})`}
            fill="url(#flower-grad)"
            stroke="#111111"
            strokeWidth="0.4"
          />
        );
      })}
      <circle r={r * 0.22} fill="#111111" />
    </g>
  );
}
