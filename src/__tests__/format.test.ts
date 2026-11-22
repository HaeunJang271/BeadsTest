import { describe, expect, it } from 'vitest';
import { formatPrice, patternLabel } from '../utils/format';

describe('formatPrice', () => {
  it('천 단위 구분과 원을 붙인다', () => {
    expect(formatPrice(10900)).toBe('10,900원');
    expect(formatPrice(8900)).toBe('8,900원');
  });
});

describe('patternLabel', () => {
  it('패턴 한글 라벨을 반환한다', () => {
    expect(patternLabel('solid')).toBe('단색');
    expect(patternLabel('accent3')).toBe('포인트 3알');
    expect(patternLabel('alternate')).toBe('교차 배열');
  });
});
