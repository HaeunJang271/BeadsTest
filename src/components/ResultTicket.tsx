import type { Gemstone } from '../types/gemstone';
import { STORE } from '../config/store';

interface ResultTicketProps {
  readonly gemstone: Gemstone;
}

/**
 * 영수증/처방전 형태의 추천 결과 티켓.
 */
export function ResultTicket({ gemstone }: ResultTicketProps) {
  return (
    <article className="result-ticket" aria-label="추천 결과 티켓">
      <header className="result-ticket__head">
        <span className="result-ticket__no ui-label">{gemstone.number}</span>
        <span className="result-ticket__brand ui-label">{STORE.brandKo}</span>
      </header>

      <div className="result-ticket__rule" />

      <p className="result-ticket__eyebrow ui-label">Recommended stone</p>
      <h2 className="result-ticket__name">{gemstone.nameKo}</h2>
      <p className="result-ticket__price italic-num">{gemstone.price.toLocaleString('ko-KR')}원</p>

      <ul className="result-ticket__keywords">
        {gemstone.keywords.map((k) => (
          <li key={k}>{k}</li>
        ))}
      </ul>

      <p className="result-ticket__desc">{gemstone.description}</p>

      <div className="result-ticket__block">
        <p className="ui-label">1분 리추얼</p>
        <p>{gemstone.ritual}</p>
      </div>
      <div className="result-ticket__block">
        <p className="ui-label">정화</p>
        <p>{gemstone.cleanse}</p>
      </div>

      <footer className="result-ticket__foot">
        <Stamp />
        <p className="ui-label">
          8mm · 0.8mm 우레탄 1겹 · {STORE.instagramHandle}
        </p>
      </footer>
    </article>
  );
}

function Stamp() {
  return (
    <svg className="result-ticket__stamp" viewBox="0 0 72 72" width="56" height="56" aria-hidden="true">
      <circle cx="36" cy="36" r="33" fill="none" stroke="var(--gold)" strokeWidth="1" />
      <circle cx="36" cy="36" r="28" fill="none" stroke="var(--gold)" strokeWidth="0.6" />
      <text
        x="36"
        y="34"
        textAnchor="middle"
        fill="var(--gold)"
        fontSize="8"
        fontFamily="var(--font-ui)"
      >
        CYNTHIA
      </text>
      <text
        x="36"
        y="46"
        textAnchor="middle"
        fill="var(--gold)"
        fontSize="7"
        fontFamily="var(--font-ui)"
      >
        MALL
      </text>
    </svg>
  );
}
