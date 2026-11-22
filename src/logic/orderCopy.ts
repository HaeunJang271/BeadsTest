import { STORE } from '../config/store';
import { getGemstone } from '../data/gemstones';
import type { BeadSlot, BraceletConfig, GemstoneId } from '../types/gemstone';
import { patternLabel } from '../utils/format';
import {
  donutMetalLabel,
  donutSpacingLabel,
  resolveSlots,
} from './braceletSlots';

/**
 * 원석별 개수 요약.
 */
export function summarizeSlots(slots: readonly BeadSlot[]): string {
  const counts = new Map<GemstoneId, number>();
  for (const s of slots) {
    counts.set(s.gemId, (counts.get(s.gemId) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([id, count]) => `${getGemstone(id).nameKo}×${count}`)
    .join(', ');
}

/**
 * DM 주문용 복붙 문구.
 */
export function buildOrderCopy(
  config: BraceletConfig,
  price: number,
): string {
  const slots = resolveSlots(config);
  const capIdx = slots
    .map((s, i) => (s.hasFlowerCap ? i + 1 : null))
    .filter((v): v is number => v !== null);

  const sequence = slots
    .map((s, i) => {
      const cap = s.hasFlowerCap ? '+캡' : '';
      return `${i + 1}.${getGemstone(s.gemId).nameKo}${cap}`;
    })
    .join(' / ');

  let stoneLine: string;
  if (config.pattern === 'custom') {
    stoneLine = `자유 커스텀 (${summarizeSlots(slots)})`;
  } else if (
    config.pattern === 'solid' ||
    config.primaryId === config.secondaryId
  ) {
    stoneLine = `${getGemstone(config.primaryId).nameKo} 단색`;
  } else {
    stoneLine = `${getGemstone(config.primaryId).nameKo} + ${getGemstone(config.secondaryId).nameKo} (${patternLabel(config.pattern)})`;
  }

  const donutLine =
    config.donutMetal === 'none'
      ? '도넛 스페이서: 없음'
      : `도넛 스페이서: ${donutMetalLabel(config.donutMetal)} · ${donutSpacingLabel(config.donutSpacing)}`;

  return [
    `[시아상점 주문]`,
    `원석: ${stoneLine}`,
    `원석 집계: ${summarizeSlots(slots)}`,
    donutLine,
    `꽃 비즈 캡: ${capIdx.length ? `${capIdx.join(', ')}번` : '없음'}`,
    `배열(1–${STORE.beadCount}): ${sequence}`,
    `가격: ${price.toLocaleString('ko-KR')}원`,
    `스펙: 8mm 원석 / 0.8mm 투명 우레탄줄 1겹 / 꽃캡 6mm`,
    `배송: 반값·알뜰 ${STORE.shipping.budget.toLocaleString('ko-KR')}원 · 일반 ${STORE.shipping.standard.toLocaleString('ko-KR')}원`,
    `인스타: ${STORE.instagramHandle}`,
  ].join('\n');
}
