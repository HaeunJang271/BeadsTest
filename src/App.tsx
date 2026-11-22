import { AnimatePresence } from 'framer-motion';
import { useCallback, useState } from 'react';
import { BeadRingPreview } from './components/BeadRingPreview';
import { BraceletControls } from './components/BraceletControls';
import { CatalogDrawer } from './components/CatalogDrawer';
import { IntroScreen } from './components/IntroScreen';
import { QuizCard } from './components/QuizCard';
import { ResultTicket } from './components/ResultTicket';
import { STORE } from './config/store';
import { QUESTIONS } from './data/questions';
import { getGemstone } from './data/gemstones';
import {
  applyBrushToBead,
  blankCustomBracelet,
  buildOrderCopy,
  calcPrice,
  defaultBracelet,
  recommend,
} from './logic/recommend';
import type {
  AnswerMap,
  AppView,
  BraceletConfig,
  CustomBrush,
  Gemstone,
  GemstoneId,
  QuestionOption,
} from './types/gemstone';
import { log } from './utils/logger';

/**
 * 시아상점 원석 팔찌 추천 & 비즈 커스텀 루트.
 */
export default function App() {
  const [view, setView] = useState<AppView>('intro');
  const [quizIndex, setQuizIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [resultGem, setResultGem] = useState<Gemstone | null>(null);
  const [bracelet, setBracelet] = useState<BraceletConfig | null>(null);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [copyState, setCopyState] = useState<'idle' | 'done' | 'error'>('idle');
  const [brush, setBrush] = useState<CustomBrush>({
    kind: 'gem',
    gemId: 'clear_crystal',
  });

  const question = QUESTIONS[quizIndex];

  const startQuiz = useCallback(() => {
    setAnswers({});
    setQuizIndex(0);
    setResultGem(null);
    setBracelet(null);
    setView('quiz');
    log('info', '퀴즈 시작');
  }, []);

  const startCustom = useCallback(() => {
    const gem = getGemstone('clear_crystal');
    setResultGem(gem);
    setBracelet(blankCustomBracelet('moonstone'));
    setBrush({ kind: 'gem', gemId: 'moonstone' });
    setView('result');
    log('info', '직접 커스텀 시작');
  }, []);

  const handleSelect = useCallback(
    (option: QuestionOption) => {
      if (!question) return;
      const nextAnswers: AnswerMap = { ...answers, [question.id]: option.id };
      setAnswers(nextAnswers);

      if (quizIndex >= QUESTIONS.length - 1) {
        const result = recommend(nextAnswers);
        setResultGem(result.gemstone);
        setBracelet(defaultBracelet(result.gemstone));
        setBrush({ kind: 'gem', gemId: result.gemstone.id });
        setView('result');
        return;
      }
      setQuizIndex((i) => i + 1);
    },
    [answers, question, quizIndex],
  );

  const handleCopy = useCallback(async () => {
    if (!bracelet) return;
    const text = buildOrderCopy(bracelet, calcPrice(bracelet));
    try {
      await navigator.clipboard.writeText(text);
      setCopyState('done');
      log('info', '주문 문구 복사');
      window.setTimeout(() => setCopyState('idle'), 2000);
    } catch (err) {
      log('error', '클립보드 복사 실패', err);
      setCopyState('error');
    }
  }, [bracelet]);

  const pickFromCatalog = useCallback((id: GemstoneId) => {
    const gem = getGemstone(id);
    setResultGem(gem);
    setBracelet(defaultBracelet(gem));
    setBrush({ kind: 'gem', gemId: id });
    setCatalogOpen(false);
    setView('result');
  }, []);

  const paintBead = useCallback(
    (index: number) => {
      if (!bracelet) return;
      setBracelet(applyBrushToBead(bracelet, index, brush));
    },
    [bracelet, brush],
  );

  return (
    <div className="app-shell">
      <header className="topbar">
        <button
          type="button"
          className="topbar__brand"
          onClick={() => setView('intro')}
        >
          {STORE.brandKo}
        </button>
        <nav className="topbar__nav">
          <button type="button" className="btn-ghost" onClick={() => setCatalogOpen(true)}>
            도감
          </button>
          {view === 'result' ? (
            <button type="button" className="btn-ghost" onClick={startQuiz}>
              다시
            </button>
          ) : null}
        </nav>
      </header>

      <main className="main">
        {view === 'intro' ? (
          <IntroScreen
            onStart={startQuiz}
            onOpenCatalog={() => setCatalogOpen(true)}
            onStartCustom={startCustom}
          />
        ) : null}

        {view === 'quiz' && question ? (
          <AnimatePresence mode="wait">
            <QuizCard
              key={question.id}
              question={question}
              total={QUESTIONS.length}
              onSelect={handleSelect}
            />
          </AnimatePresence>
        ) : null}

        {view === 'result' && resultGem && bracelet ? (
          <section className="result">
            <ResultTicket gemstone={resultGem} />
            <BeadRingPreview
              config={bracelet}
              brush={brush}
              onPaintBead={paintBead}
            />
            <BraceletControls
              config={bracelet}
              onChange={setBracelet}
              onCopy={handleCopy}
              copyState={copyState}
              orderUrl={STORE.openChatUrl}
              brush={brush}
              onBrushChange={setBrush}
            />
            <a
              className="calendar-banner"
              href={STORE.calendarUrl}
              target="_blank"
              rel="noreferrer"
            >
              함께 보기 · 2027 마녀의 달력 (KST) →
            </a>
            <p className="result__links ui-label">
              <a href={STORE.instagram} target="_blank" rel="noreferrer">
                {STORE.instagramHandle}
              </a>
              {' · '}
              <a href={STORE.tiktok} target="_blank" rel="noreferrer">
                {STORE.tiktokHandle}
              </a>
              {' · '}
              <a href={STORE.orderFormUrl} target="_blank" rel="noreferrer">
                구글폼 주문
              </a>
            </p>
          </section>
        ) : null}
      </main>

      <CatalogDrawer
        open={catalogOpen}
        onClose={() => setCatalogOpen(false)}
        onPick={pickFromCatalog}
        activeId={resultGem?.id}
      />
    </div>
  );
}
