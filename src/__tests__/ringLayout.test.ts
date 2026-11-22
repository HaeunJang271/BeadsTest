import { describe, expect, it } from 'vitest';
import { defaultBracelet } from '../logic/braceletSlots';
import { getGemstone } from '../data/gemstones';
import {
  BEAD_WIDTH,
  DONUT_WIDTH,
  buildRingItems,
  placeRingItems,
} from '../utils/ringLayout';

describe('ringLayout', () => {
  it('도넛 없으면 18알만 배치', () => {
    const cfg = defaultBracelet(getGemstone('moonstone'));
    const items = buildRingItems(cfg);
    expect(items.filter((i) => i.kind === 'bead')).toHaveLength(18);
    expect(items.filter((i) => i.kind === 'donut')).toHaveLength(0);
    const { ringR } = placeRingItems(items, 0, 0);
    expect(ringR).toBeCloseTo((18 * BEAD_WIDTH) / (2 * Math.PI), 5);
  });

  it('도넛 every3이면 두께가 ringR에 반영된다', () => {
    const cfg = {
      ...defaultBracelet(getGemstone('citrine')),
      donutMetal: 'silver' as const,
      donutSpacing: 'every3' as const,
    };
    const items = buildRingItems(cfg);
    const donuts = items.filter((i) => i.kind === 'donut');
    expect(donuts.length).toBe(6);
    const total =
      18 * BEAD_WIDTH + donuts.length * DONUT_WIDTH;
    const { ringR } = placeRingItems(items, 0, 0);
    expect(ringR).toBeCloseTo(total / (2 * Math.PI), 5);
  });
});
