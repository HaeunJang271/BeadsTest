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
  it('단색 단일석·도넛·캡 없으면 원석가', () => {
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
      { kind: 'capOn', metal: 'gold' },
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

  it('프리셋·커스텀 기본 꽃 캡은 none', () => {
    const base = solid('moonstone', {
      secondaryId: 'citrine',
      pattern: 'accent3',
    });
    expect(resolveSlots(base).every((s) => s.flowerCap === 'none')).toBe(true);
    const custom = enterCustomMode(base);
    expect(resolveSlots(custom).every((s) => s.flowerCap === 'none')).toBe(true);
  });

  it('프리셋 실버 캡은 포인트 알에만', () => {
    const cfg = solid('moonstone', {
      secondaryId: 'citrine',
      pattern: 'accent3',
      presetFlowerCap: 'silver',
    });
    const caps = resolveSlots(cfg).filter((s) => s.flowerCap === 'silver');
    expect(caps).toHaveLength(3);
  });

  it('브러시로 실버/골드 캡을 켠다', () => {
    const custom = enterCustomMode(solid('clear_crystal'));
    const on = applyBrushToBead(custom, 4, { kind: 'capOn', metal: 'silver' });
    expect(on.slots[4]?.flowerCap).toBe('silver');
    const gold = applyBrushToBead(on, 4, { kind: 'capOn', metal: 'gold' });
    expect(gold.slots[4]?.flowerCap).toBe('gold');
  });
});

describe('buildOrderCopy', () => {
  it('실버/골드 꽃 캡 번호를 구분해 출력한다', () => {
    let cfg = enterCustomMode(
      solid('moonstone', { donutMetal: 'gold', donutSpacing: 'every3' }),
    );
    cfg = applyBrushToBead(cfg, 2, { kind: 'capOn', metal: 'silver' });
    cfg = applyBrushToBead(cfg, 5, { kind: 'capOn', metal: 'gold' });
    const text = buildOrderCopy(cfg, calcPrice(cfg));
    expect(text).toContain('실버 3번');
    expect(text).toContain('골드 6번');
    expect(text).toContain('+캡(실버)');
    expect(text).toContain('+캡(골드)');
  });
});
