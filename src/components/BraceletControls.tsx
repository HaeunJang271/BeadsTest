import { GEMSTONES } from '../data/gemstones';
import { calcPrice } from '../logic/recommend';
import type { BraceletConfig, BraceletPattern, GemstoneId } from '../types/gemstone';
import { formatPrice, patternLabel } from '../utils/format';

interface BraceletControlsProps {
  readonly config: BraceletConfig;
  readonly onChange: (next: BraceletConfig) => void;
  readonly onCopy: () => void;
  readonly copyState: 'idle' | 'done' | 'error';
  readonly orderUrl: string;
}

const PATTERNS: readonly BraceletPattern[] = ['solid', 'accent3', 'alternate'];

/**
 * 패턴·보조석·꽃 스페이서·가격·주문 액션 컨트롤.
 */
export function BraceletControls({
  config,
  onChange,
  onCopy,
  copyState,
  orderUrl,
}: BraceletControlsProps) {
  const price = calcPrice(config);

  return (
    <section className="bracelet-controls" aria-label="팔찌 커스텀">
      <div className="bracelet-controls__price">
        <p className="ui-label">실시간 가격</p>
        <p className="italic-num bracelet-controls__amount">{formatPrice(price)}</p>
      </div>

      <fieldset className="ctrl-block">
        <legend className="ui-label">패턴</legend>
        <div className="chip-row">
          {PATTERNS.map((p) => (
            <button
              key={p}
              type="button"
              className={`chip${config.pattern === p ? ' is-on' : ''}`}
              onClick={() => onChange({ ...config, pattern: p })}
            >
              {patternLabel(p)}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="ctrl-block">
        <legend className="ui-label">보조석 (탭하면 즉시 반영)</legend>
        <div className="chip-row chip-row--wrap">
          {GEMSTONES.map((g) => (
            <button
              key={g.id}
              type="button"
              className={`chip chip--swatch${config.secondaryId === g.id ? ' is-on' : ''}`}
              onClick={() => selectSecondary(g.id)}
              title={g.nameKo}
            >
              <span
                className="chip__dot"
                style={{ background: g.visual.base }}
                aria-hidden="true"
              />
              <span>{g.nameKo.replace(' / 백수정', '')}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <label className="toggle-row">
        <input
          type="checkbox"
          checked={config.flowerSpacer}
          onChange={(e) =>
            onChange({ ...config, flowerSpacer: e.target.checked })
          }
        />
        <span>6mm 꽃 스페이서 추가</span>
      </label>

      <div className="bracelet-controls__actions">
        <button type="button" className="btn-primary" onClick={onCopy}>
          {copyState === 'done'
            ? '복사됨'
            : copyState === 'error'
              ? '복사 실패 — 다시'
              : '조합 문구 복사하기'}
        </button>
        <a className="btn-secondary" href={orderUrl} target="_blank" rel="noreferrer">
          주문 링크 열기
        </a>
      </div>
    </section>
  );

  function selectSecondary(id: GemstoneId): void {
    const pattern: BraceletPattern =
      config.pattern === 'solid' && id !== config.primaryId
        ? 'accent3'
        : config.pattern;
    onChange({ ...config, secondaryId: id, pattern });
  }
}
