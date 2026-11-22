import { GEMSTONES } from '../data/gemstones';
import { formatPrice } from '../utils/format';
import type { Gemstone, GemstoneId } from '../types/gemstone';

interface CatalogDrawerProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly onPick?: (id: GemstoneId) => void;
  readonly activeId?: GemstoneId;
}

/**
 * 9종 원석 도감 패널.
 */
export function CatalogDrawer({
  open,
  onClose,
  onPick,
  activeId,
}: CatalogDrawerProps) {
  if (!open) return null;

  return (
    <div className="catalog" role="dialog" aria-modal="true" aria-label="원석 도감">
      <div className="catalog__backdrop" onClick={onClose} />
      <div className="catalog__panel">
        <header className="catalog__head">
          <div>
            <p className="ui-label">Stone catalog</p>
            <h2 className="catalog__title">9종 원석 도감</h2>
          </div>
          <button type="button" className="btn-ghost" onClick={onClose}>
            닫기
          </button>
        </header>

        <ul className="catalog__list">
          {GEMSTONES.map((gem) => (
            <li key={gem.id}>
              <CatalogRow
                gem={gem}
                active={gem.id === activeId}
                onPick={onPick}
              />
            </li>
          ))}
        </ul>

        <p className="catalog__note">
          메인석 10,900원 · 기본석 8,900원 · 1:1 커스텀 조합 11,900원
        </p>
      </div>
    </div>
  );
}

function CatalogRow({
  gem,
  active,
  onPick,
}: {
  readonly gem: Gemstone;
  readonly active: boolean;
  readonly onPick?: (id: GemstoneId) => void;
}) {
  return (
    <button
      type="button"
      className={`catalog-row${active ? ' is-active' : ''}`}
      onClick={() => onPick?.(gem.id)}
    >
      <span
        className="catalog-row__swatch"
        style={{ background: gem.visual.base, borderColor: gem.visual.rim }}
        aria-hidden="true"
      />
      <span className="catalog-row__body">
        <span className="catalog-row__top">
          <span className="ui-label">{gem.number}</span>
          <span className="italic-num">{formatPrice(gem.price)}</span>
        </span>
        <span className="catalog-row__name">{gem.nameKo}</span>
        <span className="catalog-row__keys">
          {gem.keywords.join(' · ')}
        </span>
      </span>
    </button>
  );
}
