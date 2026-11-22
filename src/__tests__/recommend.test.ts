import { describe, expect, it } from 'vitest';
import { STORE } from '../config/store';
import { GEMSTONE_IDS, getGemstone } from '../data/gemstones';
import {
  applyBrushToBead,
  buildBeadSequence,
  buildOrderCopy,
  calcPrice,
  defaultBracelet,
  enterCustomMode,
  recommend,
  resolveSlots,
  verifyAllGemstonesReachable,
} from '../logic/recommend';
import type { AnswerMap, BraceletConfig, GemstoneId } from '../types/gemstone';

function solid(id: GemstoneId, extra?: Partial<BraceletConfig>): BraceletConfig {
  return { ...defaultBracelet(getGemstone(id)), ...extra };
}

describe('recommend', () => {
  it('모든 원석이 최소 1개 조합에서 우승한다', () => {
    const { ok, missing } = verifyAllGemstonesReachable();
    expect(missing).toEqual([]);
    expect(ok).toBe(true);
    expect(GEMSTONE_IDS).toHaveLength(9);
  });

  it('시그니처 경로로 문스톤을 고른다', () => {
    const answers: AnswerMap = {
      release: 'r2',
      energy: 'e2',
      color: 'c2',
      time: 't2',
      mood: 'm2',
    };
    expect(recommend(answers).gemstone.id).toBe('moonstone');
  });
});

describe('calcPrice / sequence', () => {
  it('단색 단일석·도넛 없으면 원석가', () => {
    expect(calcPrice(solid('labradorite_black'))).toBe(STORE.prices.main);
    expect(calcPrice(solid('rose_quartz'))).toBe(STORE.prices.base);
  });

  it('도넛 또는 꽃캡 또는 2종이면 11,900', () => {
    expect(
      calcPrice(solid('rose_quartz', { donutMetal: 'silver' })),
    ).toBe(STORE.prices.custom);

    const withCap = applyBrushToBead(
      enterCustomMode(solid('citrine')),
      0,
      { kind: 'capOn' },
    );
    expect(calcPrice(withCap)).toBe(STORE.prices.custom);

    expect(
      calcPrice(
        solid('moonstone', {
          secondaryId: 'citrine',
          pattern: 'alternate',
        }),
      ),
    ).toBe(STORE.prices.custom);
  });

  it('accent3는 보조석 3알', () => {
    const seq = buildBeadSequence(
      solid('clear_crystal', {
        secondaryId: 'peridot',
        pattern: 'accent3',
      }),
    );
    expect(seq.filter((id) => id === 'peridot')).toHaveLength(3);
  });

  it('프리셋·커스텀 진입 시 꽃 캡은 기본 OFF', () => {
    const base = solid('moonstone', {
      secondaryId: 'citrine',
      pattern: 'accent3',
    });
    expect(resolveSlots(base).every((s) => !s.hasFlowerCap)).toBe(true);
    const custom = enterCustomMode(base);
    expect(custom.pattern).toBe('custom');
    expect(resolveSlots(custom).every((s) => !s.hasFlowerCap)).toBe(true);
  });

  it('브러시로만 꽃 캡을 켠다', () => {
    const custom = enterCustomMode(solid('clear_crystal'));
    const on = applyBrushToBead(custom, 4, { kind: 'capOn' });
    expect(on.slots[4]?.hasFlowerCap).toBe(true);
    expect(on.slots.filter((s) => s.hasFlowerCap)).toHaveLength(1);
  });
});

describe('buildOrderCopy', () => {
  it('배열·도넛·캡 정보를 포함한다', () => {
    const cfg = enterCustomMode(
      solid('moonstone', { donutMetal: 'gold', donutSpacing: 'every3' }),
    );
    const painted = applyBrushToBead(cfg, 2, { kind: 'capOn' });
    const text = buildOrderCopy(painted, calcPrice(painted));
    expect(text).toContain('도넛 스페이서');
    expect(text).toContain('골드');
    expect(text).toContain('꽃 비즈 캡');
    expect(text).toContain('배열(1–18)');
  });
});
