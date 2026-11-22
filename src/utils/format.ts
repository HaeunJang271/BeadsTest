import type { BraceletPattern } from '../types/gemstone';

/**
 * 원 단위 가격을 한국어 표기로 포맷한다.
 */
export function formatPrice(won: number): string {
  return `${won.toLocaleString('ko-KR')}원`;
}

/**
 * 팔찌 패턴을 주문 문구용 한글 라벨로 변환한다.
 */
export function patternLabel(pattern: BraceletPattern): string {
  switch (pattern) {
    case 'solid':
      return '단색';
    case 'accent3':
      return '포인트 3알';
    case 'alternate':
      return '교차 배열';
    case 'custom':
      return '자유 커스텀';
    default: {
      const _exhaustive: never = pattern;
      return _exhaustive;
    }
  }
}
