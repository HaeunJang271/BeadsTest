/**
 * 퀴즈 상단 1px 달 위상 SVG 진행 표시.
 * 5단계에 맞춰 초승→보름 실루엣이 채워진다.
 */
interface MoonProgressProps {
  readonly step: number;
  readonly total: number;
}

export function MoonProgress({ step, total }: MoonProgressProps) {
  const phases = Array.from({ length: total }, (_, i) => i + 1);
  const span = Math.max(total - 1, 1);

  return (
    <div
      className="moon-progress"
      role="progressbar"
      aria-valuenow={step}
      aria-valuemin={1}
      aria-valuemax={total}
    >
      <svg viewBox="0 0 280 28" width="100%" height="28" aria-hidden="true">
        <defs>
          {phases.map((n) => {
            const fill = n < step ? 1 : n === step ? 0.72 : 0;
            const offset = 14 - fill * 14;
            return (
              <clipPath key={`clip-${n}`} id={`moon-phase-${n}`}>
                <rect x={-7 + offset} y="-7" width="14" height="14" />
              </clipPath>
            );
          })}
        </defs>
        <line
          x1="14"
          y1="14"
          x2="266"
          y2="14"
          stroke="var(--gold)"
          strokeWidth="1"
          opacity="0.45"
        />
        {phases.map((n) => {
          const cx = 14 + ((n - 1) / span) * 252;
          const filled = n <= step;
          return (
            <g key={n} transform={`translate(${cx}, 14)`}>
              <circle r="7" fill="none" stroke="var(--gold)" strokeWidth="1" />
              {filled ? (
                <circle
                  r="5.5"
                  fill="var(--gold)"
                  opacity={n === step ? 0.75 : 0.9}
                  clipPath={n === step ? `url(#moon-phase-${n})` : undefined}
                />
              ) : (
                <circle r="5.5" fill="var(--gold)" opacity="0.12" />
              )}
            </g>
          );
        })}
      </svg>
      <p className="moon-progress__label ui-label">
        {step} / {total}
      </p>
    </div>
  );
}
