import { describe, expect, it } from 'vitest';
import { STORE } from '../config/store';
import { GEMSTONES, getGemstone } from '../data/gemstones';

describe('gemstones catalog', () => {
  it('메인석·기본석 가격이 스펙과 일치한다', () => {
    const mains = GEMSTONES.filter((g) => g.tier === 'main');
    const bases = GEMSTONES.filter((g) => g.tier === 'base');
    expect(mains).toHaveLength(2);
    expect(bases).toHaveLength(7);
    for (const g of mains) expect(g.price).toBe(STORE.prices.main);
    for (const g of bases) expect(g.price).toBe(STORE.prices.base);
  });

  it('getGemstone이 유효 id를 반환한다', () => {
    expect(getGemstone('citrine').nameKo).toBe('시트린');
  });
});
