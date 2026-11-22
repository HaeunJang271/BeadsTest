import type { Gemstone } from '../types/gemstone';

/**
 * 원석 그라데이션 원형 스와치 버튼.
 */
export function GemSwatch({
  gem,
  selected,
  onClick,
  title,
}: {
  readonly gem: Gemstone;
  readonly selected: boolean;
  readonly onClick: () => void;
  readonly title?: string;
}) {
  const gradient = gem.visual.stops
    .map((s) => `${s.color} ${s.offset}`)
    .join(', ');

  return (
    <button
      type="button"
      className={`gem-swatch${selected ? ' is-on' : ''}`}
      onClick={onClick}
      title={title ?? gem.nameKo}
      aria-label={gem.nameKo}
      aria-pressed={selected}
      style={{
        background: `radial-gradient(circle at 32% 28%, ${gradient})`,
      }}
    />
  );
}
