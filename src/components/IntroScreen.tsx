import { STORE } from '../config/store';
import { getGemstone } from '../data/gemstones';
import { defaultBracelet } from '../logic/braceletSlots';
import type { BraceletConfig } from '../types/gemstone';
import { BeadRingPreview } from './BeadRingPreview';

interface IntroScreenProps {
  readonly onStart: () => void;
  readonly onOpenCatalog: () => void;
  readonly onStartCustom: () => void;
}

/** 인트로 대표 팔찌: 문스톤 × 라벤더 교차 + 실버 도넛(포인트) */
const INTRO_BRACELET: BraceletConfig = {
  ...defaultBracelet(getGemstone('moonstone')),
  primaryId: 'moonstone',
  secondaryId: 'lavender_amethyst',
  pattern: 'alternate',
  donutMetal: 'silver',
  donutSpacing: 'accent',
  presetFlowerCap: 'none',
};

/**
 * 첫 화면 — 감성 주얼리 셀렉트샵 톤 인트로.
 */
export function IntroScreen({
  onStart,
  onOpenCatalog,
  onStartCustom,
}: IntroScreenProps) {
  return (
    <section className="intro">
      <p className="ui-label intro__kicker">{STORE.instagramHandle}</p>
      <h1 className="intro__brand">{STORE.brandKo}</h1>

      <p className="intro__lead">
        원석 팔찌 추천과 실시간 비즈 커스텀.
        <br />
        8mm 원석, 0.8mm 투명 우레탄줄 한 겹으로 맞춥니다.
      </p>

      <div className="intro__hero">
        <BeadRingPreview config={INTRO_BRACELET} showCaption={false} />
      </div>

      <div className="intro__actions">
        <button type="button" className="btn-primary" onClick={onStart}>
          추천 시작
        </button>
        <button type="button" className="btn-secondary" onClick={onStartCustom}>
          직접 한 알씩 커스텀
        </button>
        <button type="button" className="intro__link" onClick={onOpenCatalog}>
          9종 도감 보기
        </button>
      </div>

      <p className="intro__spec ui-label">
        메인석 {STORE.prices.main.toLocaleString('ko-KR')}원 · 기본석{' '}
        {STORE.prices.base.toLocaleString('ko-KR')}원 · 커스텀{' '}
        {STORE.prices.custom.toLocaleString('ko-KR')}원
      </p>
    </section>
  );
}
