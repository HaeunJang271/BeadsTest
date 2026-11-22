import { GEMSTONES } from '../data/gemstones';
import {
  calcPrice,
  enterCustomMode,
  fillAllWithGem,
  mirrorSlotsHorizontal,
} from '../logic/recommend';
import type {
  BraceletConfig,
  BraceletPattern,
  CustomBrush,
  DonutMetal,
  DonutSpacing,
  GemstoneId,
} from '../types/gemstone';
import { formatPrice, patternLabel } from '../utils/format';

interface BraceletControlsProps {
  readonly config: BraceletConfig;
  readonly onChange: (next: BraceletConfig) => void;
  readonly onCopy: () => void;
  readonly copyState: 'idle' | 'done' | 'error';
  readonly orderUrl: string;
  readonly brush: CustomBrush;
  readonly onBrushChange: (brush: CustomBrush) => void;
}

const PRESETS: readonly BraceletPattern[] = ['solid', 'accent3', 'alternate'];
const METALS: readonly DonutMetal[] = ['none', 'silver', 'gold'];
const SPACINGS: readonly DonutSpacing[] = ['accent', 'every3', 'all'];

/**
 * 패턴·브러시·도넛·주문 컨트롤.
 */
export function BraceletControls({
  config,
  onChange,
  onCopy,
  copyState,
  orderUrl,
  brush,
  onBrushChange,
}: BraceletControlsProps) {
  const price = calcPrice(config);
  const isCustom = config.pattern === 'custom';
  const fillGem =
    brush.kind === 'gem' ? brush.gemId : config.primaryId;

  return (
    <section className="bracelet-controls" aria-label="팔찌 커스텀">
      <div className="bracelet-controls__price">
        <p className="ui-label">실시간 가격</p>
        <p className="italic-num bracelet-controls__amount">{formatPrice(price)}</p>
      </div>

      <fieldset className="ctrl-block">
        <legend className="ui-label">패턴</legend>
        <div className="chip-row chip-row--wrap">
          {PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              className={`chip${config.pattern === p ? ' is-on' : ''}`}
              onClick={() => onChange({ ...config, pattern: p })}
            >
              {patternLabel(p)}
            </button>
          ))}
          <button
            type="button"
            className={`chip${isCustom ? ' is-on' : ''}`}
            onClick={() => onChange(enterCustomMode(config))}
          >
            직접 한 알씩
          </button>
        </div>
      </fieldset>

      {isCustom ? (
        <fieldset className="ctrl-block">
          <legend className="ui-label">브러시 — 고른 뒤 알을 탭</legend>
          <div className="chip-row chip-row--wrap">
            {GEMSTONES.map((g) => (
              <button
                key={g.id}
                type="button"
                className={`chip chip--swatch${brush.kind === 'gem' && brush.gemId === g.id ? ' is-on' : ''}`}
                onClick={() => onBrushChange({ kind: 'gem', gemId: g.id })}
              >
                <span className="chip__dot" style={{ background: g.visual.base }} />
                <span>{g.nameKo.replace(' / 백수정', '')}</span>
              </button>
            ))}
            <button
              type="button"
              className={`chip${brush.kind === 'capOn' ? ' is-on' : ''}`}
              onClick={() => onBrushChange({ kind: 'capOn' })}
            >
              꽃 캡 씌우기
            </button>
            <button
              type="button"
              className={`chip${brush.kind === 'capOff' ? ' is-on' : ''}`}
              onClick={() => onBrushChange({ kind: 'capOff' })}
            >
              꽃 캡 벗기기
            </button>
          </div>
          <div className="chip-row chip-row--wrap" style={{ marginTop: 8 }}>
            <button
              type="button"
              className="chip"
              onClick={() => onChange(mirrorSlotsHorizontal(config))}
            >
              좌우 대칭 맞추기
            </button>
            <button
              type="button"
              className="chip"
              onClick={() => onChange(fillAllWithGem(config, fillGem))}
            >
              현재 돌로 전체 채우기
            </button>
          </div>
        </fieldset>
      ) : (
        <fieldset className="ctrl-block">
          <legend className="ui-label">보조석</legend>
          <div className="chip-row chip-row--wrap">
            {GEMSTONES.map((g) => (
              <button
                key={g.id}
                type="button"
                className={`chip chip--swatch${config.secondaryId === g.id ? ' is-on' : ''}`}
                onClick={() => selectSecondary(g.id)}
              >
                <span className="chip__dot" style={{ background: g.visual.base }} />
                <span>{g.nameKo.replace(' / 백수정', '')}</span>
              </button>
            ))}
          </div>
        </fieldset>
      )}

      <fieldset className="ctrl-block">
        <legend className="ui-label">도넛 스페이서</legend>
        <div className="chip-row chip-row--wrap">
          {METALS.map((m) => (
            <button
              key={m}
              type="button"
              className={`chip${config.donutMetal === m ? ' is-on' : ''}`}
              onClick={() => onChange({ ...config, donutMetal: m })}
            >
              {m === 'none' ? '없음' : m === 'silver' ? '실버' : '골드'}
            </button>
          ))}
        </div>
        {config.donutMetal !== 'none' ? (
          <div className="chip-row chip-row--wrap" style={{ marginTop: 8 }}>
            {SPACINGS.map((s) => (
              <button
                key={s}
                type="button"
                className={`chip${config.donutSpacing === s ? ' is-on' : ''}`}
                onClick={() => onChange({ ...config, donutSpacing: s })}
              >
                {s === 'accent'
                  ? '포인트 양옆'
                  : s === 'every3'
                    ? '3알마다'
                    : '모든 알 사이'}
              </button>
            ))}
          </div>
        ) : null}
      </fieldset>

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
