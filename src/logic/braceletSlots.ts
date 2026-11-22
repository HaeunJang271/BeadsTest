import { STORE } from '../config/store';
import { getGemstone } from '../data/gemstones';
import type {
  BeadSlot,
  BraceletConfig,
  CustomBrush,
  DonutMetal,
  DonutSpacing,
  FlowerCapMetal,
  Gemstone,
  GemstoneId,
} from '../types/gemstone';
import { log } from '../utils/logger';

/**
 * accent3 패턴의 포인트 알 인덱스(12시 근처 3알).
 */
export function accentIndices(n: number = STORE.beadCount): readonly number[] {
  return [0, 1, n - 1];
}

/**
 * 프리셋 원석 시퀀스만 계산한다.
 */
export function buildPresetGemIds(config: BraceletConfig): GemstoneId[] {
  const { primaryId, secondaryId, pattern } = config;
  const n = STORE.beadCount;
  const seq: GemstoneId[] = Array.from({ length: n }, () => primaryId);

  if (pattern === 'solid' || pattern === 'custom' || primaryId === secondaryId) {
    return seq;
  }
  if (pattern === 'accent3') {
    for (const i of accentIndices(n)) {
      seq[i] = secondaryId;
    }
    return seq;
  }
  for (let i = 0; i < n; i += 1) {
    seq[i] = i % 2 === 0 ? primaryId : secondaryId;
  }
  return seq;
}

/**
 * 프리셋에서 꽃 캡을 씌울 인덱스.
 * accent3 → 포인트 알 / 그 외 → 3알 간격.
 */
function presetCapIndices(
  pattern: BraceletConfig['pattern'],
  n: number,
): Set<number> {
  if (pattern === 'accent3') {
    return new Set(accentIndices(n));
  }
  const set = new Set<number>();
  for (let i = 0; i < n; i += 1) {
    if ((i + 1) % 3 === 0) set.add(i);
  }
  return set;
}

/**
 * 화면에 보일 18슬롯을 만든다.
 * 커스텀은 slots, 프리셋은 presetFlowerCap으로 포인트/3알 간격에만 반영.
 */
export function resolveSlots(config: BraceletConfig): BeadSlot[] {
  if (config.pattern === 'custom') {
    return normalizeSlots(config.slots, config.primaryId);
  }
  const gems = buildPresetGemIds(config);
  const capMetal = config.presetFlowerCap;
  const capped =
    capMetal === 'none'
      ? new Set<number>()
      : presetCapIndices(config.pattern, gems.length);

  return gems.map((gemId, index) => ({
    gemId,
    flowerCap: capped.has(index) ? capMetal : 'none',
  }));
}

/**
 * GemstoneId[] 호환용 — 슬롯에서 id만 추출.
 */
export function buildBeadSequence(config: BraceletConfig): GemstoneId[] {
  return resolveSlots(config).map((s) => s.gemId);
}

/**
 * 슬롯 길이 18 보장.
 */
export function normalizeSlots(
  slots: readonly BeadSlot[],
  fallback: GemstoneId,
): BeadSlot[] {
  const n = STORE.beadCount;
  const next = slots.slice(0, n).map((s) => ({
    gemId: s.gemId,
    flowerCap: s.flowerCap ?? 'none',
  }));
  while (next.length < n) {
    next.push({ gemId: fallback, flowerCap: 'none' });
  }
  return next;
}

/**
 * 현재 화면 상태를 복사해 자유 커스텀으로 전환한다.
 */
export function enterCustomMode(config: BraceletConfig): BraceletConfig {
  const slots = resolveSlots(config);
  log('info', '자유 커스텀 진입', { slots });
  return { ...config, pattern: 'custom', slots };
}

/**
 * 브러시로 한 알을 칠한다.
 */
export function applyBrushToBead(
  config: BraceletConfig,
  index: number,
  brush: CustomBrush,
): BraceletConfig {
  const base =
    config.pattern === 'custom' ? config : enterCustomMode(config);
  const slots = normalizeSlots(base.slots, base.primaryId);
  if (index < 0 || index >= slots.length) {
    log('warn', '유효하지 않은 비즈 인덱스', { index });
    return base;
  }
  const cur = slots[index];
  if (!cur) return base;
  const next = [...slots];
  if (brush.kind === 'gem') {
    next[index] = { gemId: brush.gemId, flowerCap: cur.flowerCap };
  } else if (brush.kind === 'capOn') {
    next[index] = { gemId: cur.gemId, flowerCap: brush.metal };
  } else {
    next[index] = { gemId: cur.gemId, flowerCap: 'none' };
  }
  return { ...base, pattern: 'custom', slots: next };
}

/**
 * 좌우 대칭(12시 축 기준) — 왼쪽(작은 인덱스)을 오른쪽에 복사한다.
 */
export function mirrorSlotsHorizontal(config: BraceletConfig): BraceletConfig {
  const base =
    config.pattern === 'custom' ? config : enterCustomMode(config);
  const slots = normalizeSlots(base.slots, base.primaryId);
  const n = slots.length;
  const mirrored = [...slots];
  for (let i = 1; i < n / 2; i += 1) {
    const src = slots[i];
    if (!src) continue;
    mirrored[n - i] = { gemId: src.gemId, flowerCap: src.flowerCap };
  }
  log('info', '좌우 대칭 적용');
  return { ...base, pattern: 'custom', slots: mirrored };
}

/**
 * 선택한 원석으로 18알을 채운다 (캡은 초기화).
 */
export function fillAllWithGem(
  config: BraceletConfig,
  gemId: GemstoneId,
): BraceletConfig {
  const slots = Array.from({ length: STORE.beadCount }, () => ({
    gemId,
    flowerCap: 'none' as const,
  }));
  return {
    ...config,
    pattern: 'custom',
    primaryId: gemId,
    secondaryId: gemId,
    slots,
  };
}

/**
 * 가격: 고유 원석 2종+ / 도넛 / 꽃캡 사용 시 11,900.
 */
export function calcPrice(config: BraceletConfig): number {
  const slots = resolveSlots(config);
  const unique = new Set(slots.map((s) => s.gemId));
  const hasCap = slots.some((s) => s.flowerCap !== 'none');
  const hasDonut = config.donutMetal !== 'none';

  if (unique.size >= 2 || hasCap || hasDonut) {
    return STORE.prices.custom;
  }
  const only = [...unique][0] ?? config.primaryId;
  return getGemstone(only).price;
}

/**
 * 추천 원석 기본 팔찌.
 */
export function defaultBracelet(gem: Gemstone): BraceletConfig {
  const slots = Array.from({ length: STORE.beadCount }, () => ({
    gemId: gem.id,
    flowerCap: 'none' as const,
  }));
  return {
    primaryId: gem.id,
    secondaryId: gem.id,
    pattern: 'solid',
    slots,
    donutMetal: 'none',
    donutSpacing: 'every3',
    presetFlowerCap: 'none',
  };
}

/**
 * 인트로에서 바로 커스텀 진입용 기본값.
 */
export function blankCustomBracelet(gemId: GemstoneId = 'moonstone'): BraceletConfig {
  return enterCustomMode(defaultBracelet(getGemstone(gemId)));
}

export function donutMetalLabel(metal: DonutMetal): string {
  switch (metal) {
    case 'none':
      return '없음';
    case 'silver':
      return '실버';
    case 'gold':
      return '골드';
    default: {
      const _e: never = metal;
      return _e;
    }
  }
}

export function flowerCapMetalLabel(metal: FlowerCapMetal): string {
  return donutMetalLabel(metal);
}

export function donutSpacingLabel(spacing: DonutSpacing): string {
  switch (spacing) {
    case 'accent':
      return '포인트 양옆';
    case 'every3':
      return '3알마다';
    case 'all':
      return '모든 알 사이';
    default: {
      const _e: never = spacing;
      return _e;
    }
  }
}
