import { GEMSTONES, getGemstone } from '../data/gemstones';
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
  FlowerCapMetal,
  GemstoneId,
} from '../types/gemstone';
import { formatPrice, patternLabel } from '../utils/format';
import { GemSwatch } from './GemSwatch';

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
const CAP_METALS: readonly FlowerCapMetal[] = ['none', 'silver', 'gold'];
const SPACINGS: readonly DonutSpacing[] = ['accent', 'every3', 'all'];

/**
 * 패턴·브러시·도넛·주문 컨트롤 (셀렉트샵 톤).
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
  const brushGemId =
    brush.kind === 'gem' ? brush.gemId : config.primaryId;
  const brushName = getGemstone(brushGemId).nameKo;
  const secondaryName = getGemstone(config.secondaryId).nameKo;

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
        <>
          <fieldset className="ctrl-block">
            <legend className="ui-label">
              원석 브러시 · {brushName}
            </legend>
            <div className="swatch-row">
              {GEMSTONES.map((g) => (
                <GemSwatch
                  key={g.id}
                  gem={g}
                  selected={brush.kind === 'gem' && brush.gemId === g.id}
                  onClick={() => onBrushChange({ kind: 'gem', gemId: g.id })}
                />
              ))}
            </div>
          </fieldset>

          <fieldset className="ctrl-block">
            <legend className="ui-label">꽃 비즈 캡</legend>
            <div className="chip-row chip-row--wrap">
              <button
                type="button"
                className={`chip${brush.kind === 'capOn' && brush.metal === 'silver' ? ' is-on' : ''}`}
                onClick={() => onBrushChange({ kind: 'capOn', metal: 'silver' })}
              >
                실버
              </button>
              <button
                type="button"
                className={`chip${brush.kind === 'capOn' && brush.metal === 'gold' ? ' is-on' : ''}`}
                onClick={() => onBrushChange({ kind: 'capOn', metal: 'gold' })}
              >
                골드
              </button>
              <button
                type="button"
                className={`chip${brush.kind === 'capOff' ? ' is-on' : ''}`}
                onClick={() => onBrushChange({ kind: 'capOff' })}
              >
                벗기기
              </button>
            </div>
          </fieldset>

          <div className="text-actions">
            <button
              type="button"
              className="text-action"
              onClick={() => onChange(mirrorSlotsHorizontal(config))}
            >
              좌우 대칭 맞추기
            </button>
            <button
              type="button"
              className="text-action"
              onClick={() => onChange(fillAllWithGem(config, brushGemId))}
            >
              전체 채우기
            </button>
          </div>
        </>
      ) : (
        <>
          <fieldset className="ctrl-block">
            <legend className="ui-label">보조석 · {secondaryName}</legend>
            <div className="swatch-row">
              {GEMSTONES.map((g) => (
                <GemSwatch
                  key={g.id}
                  gem={g}
                  selected={config.secondaryId === g.id}
                  onClick={() => selectSecondary(g.id)}
                />
              ))}
            </div>
          </fieldset>
          <fieldset className="ctrl-block">
            <legend className="ui-label">
              {config.pattern === 'accent3'
                ? '포인트 알 꽃 캡'
                : '장식 꽃 캡 (3알 간격)'}
            </legend>
            <div className="chip-row chip-row--wrap">
              {CAP_METALS.map((m) => (
                <button
                  key={m}
                  type="button"
                  className={`chip${config.presetFlowerCap === m ? ' is-on' : ''}`}
                  onClick={() => onChange({ ...config, presetFlowerCap: m })}
                >
                  {m === 'none' ? '없음' : m === 'silver' ? '실버' : '골드'}
                </button>
              ))}
            </div>
          </fieldset>
        </>
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
