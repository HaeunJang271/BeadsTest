import { describe, expect, it } from 'vitest';
import { STORE } from '../config/store';
import { GEMSTONE_IDS, getGemstone } from '../data/gemstones';
import {
  buildBeadSequence,
  buildOrderCopy,
  calcPrice,
  recommend,
  verifyAllGemstonesReachable,
} from '../logic/recommend';
import type { AnswerMap, GemstoneId } from '../types/gemstone';

describe('recommend', () => {
  it('모든 원석이 최소 1개 조합에서 우승한다', () => {
    const { ok, missing, reached } = verifyAllGemstonesReachable();
    expect(missing, `미도달 원석: ${missing.join(', ')}`).toEqual([]);
    expect(ok).toBe(true);
    for (const id of GEMSTONE_IDS) {
      expect((reached[id] ?? 0) > 0).toBe(true);
    }
  });

  it('시그니처 경로로 래브라도라이트 블랙을 고른다', () => {
    const answers: AnswerMap = {
      release: 'r1',
      energy: 'e1',
      color: 'c1',
      time: 't1',
      mood: 'm1',
    };
    expect(recommend(answers).gemstone.id).toBe('labradorite_black');
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

describe('calcPrice / buildBeadSequence', () => {
  it('단색 메인석은 10,900원', () => {
    expect(
      calcPrice({
        primaryId: 'labradorite_black',
        secondaryId: 'labradorite_black',
        pattern: 'solid',
        flowerSpacer: false,
      }),
    ).toBe(STORE.prices.main);
  });

  it('단색 기본석은 8,900원', () => {
    expect(
      calcPrice({
        primaryId: 'rose_quartz',
        secondaryId: 'rose_quartz',
        pattern: 'solid',
        flowerSpacer: false,
      }),
    ).toBe(STORE.prices.base);
  });

  it('서로 다른 석 혼합은 11,900원', () => {
    expect(
      calcPrice({
        primaryId: 'moonstone',
        secondaryId: 'citrine',
        pattern: 'alternate',
        flowerSpacer: true,
      }),
    ).toBe(STORE.prices.custom);
  });

  it('포인트 3알은 보조석 3개만 바꾼다', () => {
    const seq = buildBeadSequence({
      primaryId: 'clear_crystal',
      secondaryId: 'peridot',
      pattern: 'accent3',
      flowerSpacer: false,
    });
    expect(seq).toHaveLength(18);
    const secondary = seq.filter((id) => id === 'peridot');
    expect(secondary).toHaveLength(3);
  });

  it('교차 배열은 짝수 인덱스 메인석', () => {
    const seq = buildBeadSequence({
      primaryId: 'citrine',
      secondaryId: 'dragon_agate_blue',
      pattern: 'alternate',
      flowerSpacer: false,
    });
    expect(seq[0]).toBe('citrine');
    expect(seq[1]).toBe('dragon_agate_blue');
  });
});

describe('buildOrderCopy', () => {
  it('DM 복붙용 문구에 원석명과 가격이 들어간다', () => {
    const primary = getGemstone('moonstone');
    const secondary = getGemstone('lavender_amethyst');
    const text = buildOrderCopy({
      primary,
      secondary,
      pattern: 'accent3',
      flowerSpacer: true,
      price: STORE.prices.custom,
    });
    expect(text).toContain('문스톤');
    expect(text).toContain('라벤더 자수정');
    expect(text).toContain('11,900원');
    expect(text).toContain(STORE.instagramHandle);
  });
});

describe('gemstone catalog integrity', () => {
  it('9종 id가 모두 정의되어 있다', () => {
    const expected: GemstoneId[] = [
      'labradorite_black',
      'moonstone',
      'lavender_amethyst',
      'watermelon_redstone',
      'rose_quartz',
      'dragon_agate_blue',
      'peridot',
      'citrine',
      'clear_crystal',
    ];
    expect([...GEMSTONE_IDS]).toEqual(expected);
  });
});
