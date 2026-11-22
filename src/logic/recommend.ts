import { GEMSTONE_IDS, getGemstone } from '../data/gemstones';
import { QUESTIONS } from '../data/questions';
import type {
  AnswerMap,
  BraceletPattern,
  GemstoneId,
  QuestionId,
  RecommendResult,
} from '../types/gemstone';
import { log } from '../utils/logger';

export {
  applyBrushToBead,
  blankCustomBracelet,
  buildBeadSequence,
  buildPresetGemIds,
  calcPrice,
  defaultBracelet,
  donutMetalLabel,
  donutSpacingLabel,
  enterCustomMode,
  fillAllWithGem,
  flowerCapMetalLabel,
  mirrorSlotsHorizontal,
  normalizeSlots,
  resolveSlots,
} from './braceletSlots';

export { buildOrderCopy, summarizeFlowerCaps, summarizeSlots } from './orderCopy';

/**
 * 빈 점수표를 만든다.
 */
function emptyScores(): Record<GemstoneId, number> {
  return {
    labradorite_black: 0,
    moonstone: 0,
    lavender_amethyst: 0,
    watermelon_redstone: 0,
    rose_quartz: 0,
    dragon_agate_blue: 0,
    peridot: 0,
    citrine: 0,
    clear_crystal: 0,
  };
}

export interface RecommendOptions {
  readonly silent?: boolean;
}

/**
 * 답변 맵을 가중치 합산해 추천 원석을 고른다.
 */
export function recommend(
  answers: AnswerMap,
  options: RecommendOptions = {},
): RecommendResult {
  const scores = emptyScores();

  for (const question of QUESTIONS) {
    const optionId = answers[question.id];
    if (!optionId) continue;
    const option = question.options.find((o) => o.id === optionId);
    if (!option) {
      log('warn', '알 수 없는 선택지', { questionId: question.id, optionId });
      continue;
    }
    for (const [gemId, weight] of Object.entries(option.weights)) {
      const id = gemId as GemstoneId;
      scores[id] = (scores[id] ?? 0) + (weight ?? 0);
    }
  }

  let bestScore = -1;
  const tiedIds: GemstoneId[] = [];
  for (const id of GEMSTONE_IDS) {
    const score = scores[id] ?? 0;
    if (score > bestScore) {
      bestScore = score;
      tiedIds.length = 0;
      tiedIds.push(id);
    } else if (score === bestScore) {
      tiedIds.push(id);
    }
  }

  const winnerId = tiedIds[0];
  if (!winnerId) throw new Error('추천 결과를 계산할 수 없습니다.');

  const gemstone = getGemstone(winnerId);
  if (!options.silent) {
    log('info', '추천 완료', { winner: gemstone.nameKo, scores });
  }
  return { gemstone, scores, tiedIds };
}

/**
 * 모든 선택 조합을 순회해 각 원석이 최소 1회 우승하는지 검증한다.
 */
export function verifyAllGemstonesReachable(): {
  ok: boolean;
  reached: Readonly<Record<GemstoneId, number>>;
  missing: readonly GemstoneId[];
} {
  const reached = emptyScores();

  function walk(index: number, answers: AnswerMap): void {
    if (index >= QUESTIONS.length) {
      const result = recommend(answers, { silent: true });
      reached[result.gemstone.id] = (reached[result.gemstone.id] ?? 0) + 1;
      return;
    }
    const question = QUESTIONS[index];
    if (!question) return;
    for (const option of question.options) {
      walk(index + 1, { ...answers, [question.id]: option.id });
    }
  }

  walk(0, {});
  const missing = GEMSTONE_IDS.filter((id) => (reached[id] ?? 0) === 0);
  const ok = missing.length === 0;
  log(ok ? 'info' : 'error', '도달 검증', { reached, missing });
  return { ok, reached, missing };
}

export type { AnswerMap, BraceletPattern, QuestionId };
