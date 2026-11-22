import { resolveSlots } from '../logic/braceletSlots';
import type {
  BeadSlot,
  BraceletConfig,
  DonutMetal,
  GemstoneId,
} from '../types/gemstone';

export const BEAD_R = 16;
export const BEAD_WIDTH = BEAD_R * 2;
/** 도넛 스페이서 두께(실 방향) */
export const DONUT_WIDTH = 5.5;

/**
 * 6mm 꽃 비즈 캡 — 비즈 겉(외곽)을 감싸는 컵.
 * outerX: 캡 원점(실 구멍)이 비즈 중심에서 접선 방향으로 떨어진 거리 (±15~20.5)
 * halfH: 겉면을 덮는 세로 반높이
 * wrap: 바깥 끝에서 비즈 표면 쪽으로 감싸 들어오는 깊이
 */
export const FLOWER_CAP = {
  outerX: 18.5,
  halfH: 10,
  wrap: 8.5,
} as const;

export type RingBeadItem = {
  readonly kind: 'bead';
  readonly gemId: GemstoneId;
  readonly hasFlowerCap: boolean;
  readonly width: number;
  readonly beadIndex: number;
};

export type RingDonutItem = {
  readonly kind: 'donut';
  readonly metal: Exclude<DonutMetal, 'none'>;
  readonly width: number;
};

export type RingItem = RingBeadItem | RingDonutItem;

export interface PlacedRingItem {
  readonly item: RingItem;
  readonly angle: number;
  readonly x: number;
  readonly y: number;
  readonly angleDeg: number;
}

/**
 * 도넛을 끼울 갭(알 i 다음) 집합.
 */
export function donutGapAfterIndices(
  config: BraceletConfig,
  n: number,
): Set<number> {
  const gaps = new Set<number>();
  if (config.donutMetal === 'none') return gaps;

  if (config.donutSpacing === 'all') {
    for (let i = 0; i < n; i += 1) gaps.add(i);
    return gaps;
  }
  if (config.donutSpacing === 'every3') {
    for (let i = 0; i < n; i += 1) {
      if ((i + 1) % 3 === 0) gaps.add(i);
    }
    return gaps;
  }

  // accent — 포인트 알 양옆 갭 (커스텀은 꽃캡 알을 포인트로)
  const accents = new Set<number>([0, 1, n - 1]);
  if (config.pattern === 'custom') {
    resolveSlots(config).forEach((s, i) => {
      if (s.hasFlowerCap) accents.add(i);
    });
  }
  for (const a of accents) {
    gaps.add((a - 1 + n) % n);
    gaps.add(a);
  }
  return gaps;
}

/**
 * 슬롯 + 도넛을 폭 있는 링 아이템으로 펼친다.
 */
export function buildRingItems(config: BraceletConfig): RingItem[] {
  const slots: BeadSlot[] = resolveSlots(config);
  const gaps = donutGapAfterIndices(config, slots.length);
  const metal = config.donutMetal;
  const items: RingItem[] = [];

  slots.forEach((slot, i) => {
    items.push({
      kind: 'bead',
      gemId: slot.gemId,
      hasFlowerCap: slot.hasFlowerCap,
      width: BEAD_WIDTH,
      beadIndex: i,
    });
    if (metal !== 'none' && gaps.has(i)) {
      items.push({ kind: 'donut', metal, width: DONUT_WIDTH });
    }
  });

  return items;
}

/**
 * 폭 누적 각도로 배치한다.
 */
export function placeRingItems(
  items: readonly RingItem[],
  cx: number,
  cy: number,
): { readonly ringR: number; readonly placed: readonly PlacedRingItem[] } {
  const totalWidth = items.reduce((sum, it) => sum + it.width, 0);
  const ringR = totalWidth / (2 * Math.PI);

  let walked = 0;
  const placed: PlacedRingItem[] = items.map((item) => {
    const center = walked + item.width / 2;
    const angle = center / ringR - Math.PI / 2;
    walked += item.width;
    return {
      item,
      angle,
      angleDeg: (angle * 180) / Math.PI,
      x: cx + Math.cos(angle) * ringR,
      y: cy + Math.sin(angle) * ringR,
    };
  });

  return { ringR, placed };
}
