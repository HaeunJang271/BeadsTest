import { motion } from 'framer-motion';
import type { Question, QuestionOption } from '../types/gemstone';
import { MoonProgress } from './MoonProgress';

interface QuizCardProps {
  readonly question: Question;
  readonly total: number;
  readonly onSelect: (option: QuestionOption) => void;
}

const transition = { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] as const };

/**
 * 5문항 에디토리얼 퀴즈 카드.
 * 0.25s 절제된 페이드·슬라이드 (스프링 없음).
 */
export function QuizCard({ question, total, onSelect }: QuizCardProps) {
  return (
    <motion.section
      key={question.id}
      className="quiz-card"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={transition}
      aria-labelledby={`q-title-${question.id}`}
    >
      <MoonProgress step={question.step} total={total} />

      <p className="quiz-card__eyebrow ui-label">Question {String(question.step).padStart(2, '0')}</p>
      <h2 id={`q-title-${question.id}`} className="quiz-card__title">
        {question.title}
      </h2>
      <p className="quiz-card__subtitle">{question.subtitle}</p>

      <ul className="quiz-card__options">
        {question.options.map((option) => (
          <li key={option.id}>
            <button
              type="button"
              className="quiz-option"
              onClick={() => onSelect(option)}
            >
              <span className="quiz-option__label">{option.label}</span>
              <span className="quiz-option__hint ui-label">{option.hint}</span>
            </button>
          </li>
        ))}
      </ul>
    </motion.section>
  );
}
