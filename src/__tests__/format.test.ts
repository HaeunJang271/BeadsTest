import { describe, expect, it } from 'vitest';
import { flowerCapLabel, formatPrice, patternLabel } from '../utils/format';

describe('formatPrice', () => {
  it('천 단위 구분과 원을 붙인다', () => {
    expect(formatPrice(10900)).toBe('10,900원');
  });
});

describe('labels', () => {
  it('패턴·꽃캡 라벨을 반환한다', () => {
    expect(patternLabel('custom')).toBe('자유 커스텀');
    expect(flowerCapLabel('silver')).toBe('실버');
    expect(flowerCapLabel('gold')).toBe('골드');
    expect(flowerCapLabel('none')).toBe('없음');
  });
});
