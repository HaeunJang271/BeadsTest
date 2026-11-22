import { buildBeadSequence } from '../logic/recommend';
import type { BraceletConfig, GemstoneId } from '../types/gemstone';

export const BEAD_R = 16;
/** 비즈 직경 — 맞닿는 배치의 호 길이 */
export const BEAD_WIDTH = BEAD_R * 2;
/** 6mm 꽃 스페이서 슬롯 폭 */
export const SPACER_WIDTH = 12;

export type RingBeadItem = {
  readonly kind: 'bead';
  readonly gemId: GemstoneId;
  readonly width: number;
};

export type RingSpacerItem = {
  readonly kind: 'spacer';
  readonly width: number;
};

export type RingItem = RingBeadItem | RingSpacerItem;

export interface PlacedRingItem {
  readonly item: RingItem;
  /** 12시 기준 라디안 각도 */
  readonly angle: number;
  readonly x: number;
  readonly y: number;
  /** SVG rotate용 도(degree) */
  readonly angleDeg: number;
}

/**
 * 비즈 시퀀스에 꽃 스페이서 슬롯을 끼워 넣은 링 아이템 배열을 만든다.
 * 스페이서 ON이면 3알마다 슬롯 1개를 삽입한다(총 6개).
 */
export function buildRingItems(config: BraceletConfig): RingItem[] {
  const beads = buildBeadSequence(config);
  const items: RingItem[] = [];

  beads.forEach((gemId, i) => {
    items.push({ kind: 'bead', gemId, width: BEAD_WIDTH });
    if (config.flowerSpacer && (i + 1) % 3 === 0) {
      items.push({ kind: 'spacer', width: SPACER_WIDTH });
    }
  });

  return items;
}

/**
 * 아이템 폭 합으로 ringR을 정하고, 누적 각도로 좌표를 배치한다.
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
