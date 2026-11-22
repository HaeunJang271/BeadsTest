import { describe, expect, it } from 'vitest';
import { defaultBracelet } from '../logic/braceletSlots';
import { getGemstone } from '../data/gemstones';
import {
  BEAD_WIDTH,
  CAPPED_BEAD_WIDTH,
  DONUT_WIDTH,
  FLOWER_CAP,
  buildRingItems,
  placeRingItems,
} from '../utils/ringLayout';
import { enterCustomMode, applyBrushToBead } from '../logic/braceletSlots';

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

  it('꽃 캡 비즈는 width 46으로 옆 도넛과 겹치지 않는 폭을 확보한다', () => {
    expect(FLOWER_CAP.outerX).toBe(21.5);
    expect(FLOWER_CAP.halfH).toBe(13.5);
    expect(FLOWER_CAP.capNeck).toBe(7);
    expect(CAPPED_BEAD_WIDTH).toBe(46);

    let cfg = enterCustomMode(defaultBracelet(getGemstone('moonstone')));
    cfg = applyBrushToBead(cfg, 0, { kind: 'capOn', metal: 'silver' });
    cfg = { ...cfg, donutMetal: 'silver', donutSpacing: 'all' };
    const items = buildRingItems(cfg);
    const capped = items.find(
      (it) => it.kind === 'bead' && it.beadIndex === 0,
    );
    expect(capped?.kind === 'bead' && capped.width).toBe(46);
  });
});
