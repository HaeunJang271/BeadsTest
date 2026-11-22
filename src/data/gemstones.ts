import { STORE } from '../config/store';
import type { Gemstone, GemstoneId } from '../types/gemstone';

/** 9종 원석 라인업 — 가격·스펙 변경 금지 */
export const GEMSTONES: readonly Gemstone[] = [
  {
    id: 'labradorite_black',
    nameKo: '래브라도라이트 블랙',
    tier: 'main',
    price: STORE.prices.main,
    number: 'NO.01',
    keywords: ['보호', '경계 세우기', '기 빨림 방지'],
    description:
      '사람 많은 날, 집에 와서도 말소리가 머릿속에 남는 타입에게. 손목에 올려두면 하루치 기운을 여기서 끊는 느낌이 들어요.',
    ritual: '현관 들어오기 전 한 번 만지고, 오늘 안 가져갈 말을 내려놓는다.',
    cleanse: '그늘진 창가에 하룻밤. 물에 담그지 말 것.',
    visual: {
      base: '#1A1C22',
      rim: '#3A4250',
      stops: [
        { offset: '0%', color: '#4A5568' },
        { offset: '35%', color: '#2A3040' },
        { offset: '55%', color: '#1A2230' },
        { offset: '70%', color: '#2E4A5C' },
        { offset: '100%', color: '#12141A' },
      ],
    },
  },
  {
    id: 'moonstone',
    nameKo: '문스톤',
    tier: 'main',
    price: STORE.prices.main,
    number: 'NO.02',
    keywords: ['감정 진정', '직관', '잠 못 드는 밤'],
    description:
      '새벽 2시에 생각 끊기 힘들 때 손목에 거는 돌. 0.8mm 한 겹이라 데일리로 가볍게 차기 좋아요.',
    ritual: '불 끄기 전 호흡 네 번. 돌 표면의 흐린 광을 잠시 본다.',
    cleanse: '달빛 드는 선반에 하룻밤. 직사광은 피한다.',
    visual: {
      base: '#E8E4DC',
      rim: '#C8C0B4',
      stops: [
        { offset: '0%', color: '#F7F4EE' },
        { offset: '40%', color: '#E4DFD4' },
        { offset: '65%', color: '#D0C8BC' },
        { offset: '85%', color: '#B8C4D0' },
        { offset: '100%', color: '#C8BEB0' },
      ],
    },
  },
  {
    id: 'lavender_amethyst',
    nameKo: '라벤더 자수정',
    tier: 'base',
    price: STORE.prices.base,
    number: 'NO.03',
    keywords: ['잡생각 비우기', '숙면', '마음의 안개'],
    description:
      '잠들기 전 할 일 목록이 한 바퀴 더 도는 날. 연보라 알이 저녁 조명 아래에서 조용히 자리를 잡아요.',
    ritual: '베개 옆에 두고, 내일로 미룰 일 하나만 적는다.',
    cleanse: '부드러운 천으로 닦은 뒤 서늘한 서랍에 둔다.',
    visual: {
      base: '#9B7BA8',
      rim: '#6E5478',
      stops: [
        { offset: '0%', color: '#D4C0DC' },
        { offset: '35%', color: '#A888B8' },
        { offset: '60%', color: '#7A5A88' },
        { offset: '100%', color: '#5A4068' },
      ],
    },
  },
  {
    id: 'watermelon_redstone',
    nameKo: '수박 레드스톤',
    tier: 'base',
    price: STORE.prices.base,
    number: 'NO.04',
    keywords: ['추진력', '작은 불씨', '첫걸음'],
    description:
      '지친 날에도 할 일 하나는 끝내고 싶을 때. 분홍–붉은 결이 손목에서 작은 불씨처럼 보여요.',
    ritual: '아침에 할 일 하나만 고르고 돌을 한 번 누른다.',
    cleanse: '미지근한 물에 짧게 헹군 뒤 그늘 건조.',
    visual: {
      base: '#C45A6A',
      rim: '#8A3040',
      stops: [
        { offset: '0%', color: '#E8A0A8' },
        { offset: '30%', color: '#D07080' },
        { offset: '55%', color: '#B04050' },
        { offset: '80%', color: '#7A9A70' },
        { offset: '100%', color: '#903848' },
      ],
    },
  },
  {
    id: 'rose_quartz',
    nameKo: '로즈쿼츠',
    tier: 'base',
    price: STORE.prices.base,
    number: 'NO.05',
    keywords: ['자기 돌봄', '다정함', '날 선 마음'],
    description:
      '나에게만 유독 매정했던 주를 지나고 있을 때. 연분홍 알은 과장 없이 손목을 부드럽게 잡아요.',
    ritual: '거울 앞에서 오늘 나에게 괜찮다고 한 문장만 말한다.',
    cleanse: '소금물에 30분. 물기 제거 후 통풍.',
    visual: {
      base: '#E8B8C0',
      rim: '#C89098',
      stops: [
        { offset: '0%', color: '#F8E0E4' },
        { offset: '40%', color: '#E8B8C0' },
        { offset: '70%', color: '#D098A0' },
        { offset: '100%', color: '#C08088' },
      ],
    },
  },
  {
    id: 'dragon_agate_blue',
    nameKo: '드래곤 아게이트 블루',
    tier: 'base',
    price: STORE.prices.base,
    number: 'NO.06',
    keywords: ['차분한 말', '시험·발표', '집중'],
    description:
      '발표 전날 말문이 막힐 때. 푸른 무늬 알을 만지며 첫 문장만 연습해 보세요.',
    ritual: '시작 전 호흡 두 번, 첫 문장만 소리 내어 읽는다.',
    cleanse: '흐르는 물에 짧게. 직사광선은 피한다.',
    visual: {
      base: '#4A7A9A',
      rim: '#2A4A60',
      stops: [
        { offset: '0%', color: '#A8C8D8' },
        { offset: '25%', color: '#6A9AB0' },
        { offset: '50%', color: '#3A6A88' },
        { offset: '75%', color: '#C8D8E0' },
        { offset: '100%', color: '#2A4860' },
      ],
    },
  },
  {
    id: 'peridot',
    nameKo: '페리도트',
    tier: 'base',
    price: STORE.prices.base,
    number: 'NO.07',
    keywords: ['묵은 감정', '새 출발', '기분 환기'],
    description:
      '지난주 일을 아직 붙잡고 있을 때. 연두 알이 낮 빛에서 기분만 살짝 환기해 줘요.',
    ritual: '창문을 열고 묵은 메모 한 장을 버린다.',
    cleanse: '맑은 날 그늘 통풍 2시간.',
    visual: {
      base: '#8AAA4A',
      rim: '#5A7A28',
      stops: [
        { offset: '0%', color: '#C8E070' },
        { offset: '40%', color: '#98B848' },
        { offset: '70%', color: '#6A8830' },
        { offset: '100%', color: '#507020' },
      ],
    },
  },
  {
    id: 'citrine',
    nameKo: '시트린',
    tier: 'base',
    price: STORE.prices.base,
    number: 'NO.08',
    keywords: ['작은 행운', '자신감', '활력'],
    description:
      '면접·첫 출근처럼 작은 용기가 필요할 때. 호박빛 알이 소매 밖으로 살짝 비칩니다.',
    ritual: '외출 전 손목을 한 번 돌려 빛을 받는다.',
    cleanse: '아침 햇살 30분. 장시간 직사는 피한다.',
    visual: {
      base: '#D4A040',
      rim: '#A07020',
      stops: [
        { offset: '0%', color: '#F0D070' },
        { offset: '40%', color: '#D4A040' },
        { offset: '70%', color: '#B88028' },
        { offset: '100%', color: '#906018' },
      ],
    },
  },
  {
    id: 'clear_crystal',
    nameKo: '크리스탈 투명 / 백수정',
    tier: 'base',
    price: STORE.prices.base,
    number: 'NO.09',
    keywords: ['정화', '초기화', '기본석'],
    description:
      '어떤 돌과도 섞이는 기본석. 팔찌를 처음 맞출 때, 혹은 조합을 리셋하고 싶을 때 둡니다.',
    ritual: '주말에 줄을 풀었다 다시 끼우며 구성을 점검한다.',
    cleanse: '물 헹굼 후 완전 건조. 가장 다루기 쉬운 돌.',
    visual: {
      base: '#E8ECEF',
      rim: '#A8B0B8',
      stops: [
        { offset: '0%', color: '#FFFFFF' },
        { offset: '45%', color: '#E4E8EC' },
        { offset: '70%', color: '#C8D0D8' },
        { offset: '100%', color: '#B0B8C0' },
      ],
    },
  },
] as const;

export const GEMSTONE_MAP: Readonly<Record<GemstoneId, Gemstone>> =
  Object.fromEntries(GEMSTONES.map((g) => [g.id, g])) as Record<
    GemstoneId,
    Gemstone
  >;

export const GEMSTONE_IDS: readonly GemstoneId[] = GEMSTONES.map((g) => g.id);

/**
 * id로 원석을 조회한다. 없으면 예외.
 */
export function getGemstone(id: GemstoneId): Gemstone {
  const gem = GEMSTONE_MAP[id];
  if (!gem) {
    throw new Error(`Unknown gemstone id: ${id}`);
  }
  return gem;
}
