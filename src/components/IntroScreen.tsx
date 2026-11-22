import { STORE } from '../config/store';

interface IntroScreenProps {
  readonly onStart: () => void;
  readonly onOpenCatalog: () => void;
}

/**
 * 첫 화면 — 편집샵 톤 인트로.
 */
export function IntroScreen({ onStart, onOpenCatalog }: IntroScreenProps) {
  return (
    <section className="intro">
      <p className="ui-label intro__kicker">{STORE.instagramHandle}</p>

      <h1 className="intro__brand">{STORE.brandKo}</h1>
      <p className="intro__en italic-num">{STORE.brandEn}</p>

      <hr className="intro__rule" />

      <p className="intro__lead">
        원석 팔찌 추천과 실시간 비즈 커스텀.
        <br />
        8mm 원석, 0.8mm 투명 우레탄줄 한 겹으로 맞춥니다.
      </p>

      <dl className="intro__meta">
        <div className="intro__meta-row">
          <dt>Step 01</dt>
          <dd>다섯 문항으로 맞는 돌을 고릅니다.</dd>
        </div>
        <div className="intro__meta-row">
          <dt>Step 02</dt>
          <dd>결과 티켓과 SVG 팔찌로 조합을 만듭니다.</dd>
        </div>
        <div className="intro__meta-row">
          <dt>Step 03</dt>
          <dd>문구를 복사해 DM으로 주문합니다.</dd>
        </div>
      </dl>

      <div className="intro__actions">
        <button type="button" className="btn-primary" onClick={onStart}>
          추천 시작
        </button>
        <button type="button" className="btn-secondary" onClick={onOpenCatalog}>
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
