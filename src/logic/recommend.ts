import { STORE } from '../config/store';
import { GEMSTONE_IDS, getGemstone } from '../data/gemstones';
import { QUESTIONS } from '../data/questions';
import type {
  AnswerMap,
  BraceletConfig,
  BraceletPattern,
  Gemstone,
  GemstoneId,
  OrderCopyPayload,
  QuestionId,
  RecommendResult,
} from '../types/gemstone';
import { patternLabel } from '../utils/format';
import { log } from '../utils/logger';

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
 * 동점이면 라인업 순서(메인석 우선)로 안정적으로 선택한다.
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
      const w = weight ?? 0;
      scores[id] = (scores[id] ?? 0) + w;
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
  if (!winnerId) {
    throw new Error('추천 결과를 계산할 수 없습니다.');
  }

  const gemstone = getGemstone(winnerId);
  if (!options.silent) {
    log('info', '추천 완료', { winner: gemstone.nameKo, scores });
  }

  return { gemstone, scores, tiedIds };
}

/**
 * 팔찌 구성에 따른 판매가를 계산한다.
 * 단색·동일석 = 해당 원석가, 서로 다른 석 혼합 = 11,900원.
 */
export function calcPrice(config: BraceletConfig): number {
  const primary = getGemstone(config.primaryId);
  const secondary = getGemstone(config.secondaryId);

  if (config.pattern === 'solid' || config.primaryId === config.secondaryId) {
    return primary.price;
  }

  void secondary;
  return STORE.prices.custom;
}

/**
 * 18알 원형 배치용 원석 id 배열을 만든다.
 */
export function buildBeadSequence(config: BraceletConfig): GemstoneId[] {
  const { primaryId, secondaryId, pattern } = config;
  const n = STORE.beadCount;
  const seq: GemstoneId[] = Array.from({ length: n }, () => primaryId);

  if (pattern === 'solid' || primaryId === secondaryId) {
    return seq;
  }

  if (pattern === 'accent3') {
    // 12시 방향 근처 3알을 보조석으로
    const accents = [0, 1, n - 1] as const;
    for (const i of accents) {
      seq[i] = secondaryId;
    }
    return seq;
  }

  // alternate
  for (let i = 0; i < n; i += 1) {
    seq[i] = i % 2 === 0 ? primaryId : secondaryId;
  }
  return seq;
}

/**
 * DM 주문용 복붙 문구를 생성한다.
 */
export function buildOrderCopy(payload: OrderCopyPayload): string {
  const { primary, secondary, pattern, flowerSpacer, price } = payload;
  const mix =
    pattern === 'solid' || primary.id === secondary.id
      ? `${primary.nameKo} 단색`
      : `${primary.nameKo} + ${secondary.nameKo} (${patternLabel(pattern)})`;

  return [
    `[시아상점 주문]`,
    `원석: ${mix}`,
    `꽃 스페이서(6mm): ${flowerSpacer ? '추가' : '없음'}`,
    `가격: ${price.toLocaleString('ko-KR')}원`,
    `스펙: 8mm 원석 / 0.8mm 투명 우레탄줄 1겹`,
    `배송: 반값·알뜰 ${STORE.shipping.budget.toLocaleString('ko-KR')}원 · 일반 ${STORE.shipping.standard.toLocaleString('ko-KR')}원`,
    `인스타: ${STORE.instagramHandle}`,
  ].join('\n');
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
  const questionIds = QUESTIONS.map((q) => q.id);

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

  void questionIds;
  return { ok, reached, missing };
}

/**
 * 추천 원석으로 기본 팔찌 설정을 만든다.
 */
export function defaultBracelet(gem: Gemstone): BraceletConfig {
  return {
    primaryId: gem.id,
    secondaryId: gem.id,
    pattern: 'solid',
    flowerSpacer: false,
  };
}

export type { AnswerMap, BraceletPattern, QuestionId };
