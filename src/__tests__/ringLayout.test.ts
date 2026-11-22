import { describe, expect, it } from 'vitest';
import {
  BEAD_R,
  BEAD_WIDTH,
  SPACER_WIDTH,
  buildRingItems,
  placeRingItems,
} from '../utils/ringLayout';

describe('ringLayout', () => {
  it('스페이서 OFF면 비즈 18알만 배치하고 ringR이 맞닿는 비율이다', () => {
    const items = buildRingItems({
      primaryId: 'moonstone',
      secondaryId: 'moonstone',
      pattern: 'solid',
      flowerSpacer: false,
    });
    expect(items).toHaveLength(18);
    expect(items.every((i) => i.kind === 'bead')).toBe(true);

    const { ringR, placed } = placeRingItems(items, 170, 170);
    expect(ringR).toBeCloseTo((18 * BEAD_WIDTH) / (2 * Math.PI), 5);
    expect(placed).toHaveLength(18);

    const first = placed[0];
    const second = placed[1];
    if (!first || !second) throw new Error('배치 실패');
    // 원호 길이 BEAD_WIDTH에 대응하는 현 길이
    const theta = BEAD_WIDTH / ringR;
    const chord = 2 * ringR * Math.sin(theta / 2);
    const dist = Math.hypot(first.x - second.x, first.y - second.y);
    expect(dist).toBeCloseTo(chord, 5);
    expect(chord).toBeLessThan(BEAD_WIDTH);
    expect(BEAD_R).toBe(16);
  });

  it('스페이서 ON이면 슬롯 6개가 끼워지고 폭 합으로 ringR을 잡는다', () => {
    const items = buildRingItems({
      primaryId: 'citrine',
      secondaryId: 'peridot',
      pattern: 'alternate',
      flowerSpacer: true,
    });
    const spacers = items.filter((i) => i.kind === 'spacer');
    const beads = items.filter((i) => i.kind === 'bead');
    expect(beads).toHaveLength(18);
    expect(spacers).toHaveLength(6);
    expect(spacers.every((s) => s.width === SPACER_WIDTH)).toBe(true);

    const total = 18 * BEAD_WIDTH + 6 * SPACER_WIDTH;
    const { ringR } = placeRingItems(items, 0, 0);
    expect(ringR).toBeCloseTo(total / (2 * Math.PI), 5);
  });
});
