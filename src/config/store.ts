/**
 * 상점 외부 링크·브랜드 상수.
 * URL만 이 파일에서 바꾸면 전체 앱에 반영된다.
 */
export const STORE = {
  brandKo: '시아상점',
  brandEn: 'cynthia.mall_official',
  instagram: 'https://www.instagram.com/cynthia.mall_official/',
  instagramHandle: '@cynthia.mall_official',
  tiktok: 'https://www.tiktok.com/@witch_cynthia',
  tiktokHandle: '@witch_cynthia',
  /** 1:1 커스텀·주문 구글폼 (플레이스홀더 — 실제 URL로 교체) */
  orderFormUrl: 'https://forms.gle/cynthia-mall-order',
  /** 카카오 1:1 오픈채팅 (플레이스홀더) */
  openChatUrl: 'https://open.kakao.com/o/cynthia-mall',
  /** 2027 마녀의 달력 KST */
  calendarUrl: 'https://cynthia.mall/2027-witch-calendar',
  beadCount: 18,
  beadMm: 8,
  flowerSpacerMm: 6,
  shipping: {
    budget: 2000,
    standard: 3800,
  },
  prices: {
    base: 8900,
    main: 10900,
    custom: 11900,
  },
} as const;

export type StoreConfig = typeof STORE;
