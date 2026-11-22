import type { Question } from '../types/gemstone';

/**
 * 5문항 에디토리얼 퀴즈.
 * 가중치는 recommend.ts에서 합산되며, 검증 스크립트가 9종 도달을 보장한다.
 */
export const QUESTIONS: readonly Question[] = [
  {
    id: 'release',
    step: 1,
    title: '덜어내고 싶은 마음은?',
    subtitle: '요즘 손목에 걸고 싶은 쪽을 고르세요.',
    options: [
      {
        id: 'r1',
        label: '사람 사이 기운이 너무 많이 닳는 날',
        hint: '경계가 필요할 때',
        weights: {
          labradorite_black: 3,
          clear_crystal: 1,
          dragon_agate_blue: 1,
        },
      },
      {
        id: 'r2',
        label: '잠들기 전 생각이 한 바퀴 더 도는 밤',
        hint: '리듬을 가라앉히고 싶을 때',
        weights: {
          moonstone: 3,
          lavender_amethyst: 2,
          rose_quartz: 1,
        },
      },
      {
        id: 'r3',
        label: '미뤄 둔 첫걸음이 계속 걸리는 상태',
        hint: '작은 불씨가 필요할 때',
        weights: {
          watermelon_redstone: 3,
          citrine: 2,
          peridot: 1,
        },
      },
      {
        id: 'r4',
        label: '나에게만 유독 날카로웠던 한 주',
        hint: '다정함을 되찾고 싶을 때',
        weights: {
          rose_quartz: 3,
          moonstone: 1,
          lavender_amethyst: 1,
        },
      },
      {
        id: 'r5',
        label: '머릿속이 복잡해서 한 번 비우고 싶을 때',
        hint: '초기화가 필요할 때',
        weights: {
          clear_crystal: 3,
          lavender_amethyst: 2,
          peridot: 1,
        },
      },
    ],
  },
  {
    id: 'energy',
    step: 2,
    title: '원하는 에너지는?',
    subtitle: '지금 손에 쥐고 싶은 감각에 가깝게.',
    options: [
      {
        id: 'e1',
        label: '보호막처럼 단단한 쪽',
        hint: '밖과 나를 나누는 선',
        weights: {
          labradorite_black: 3,
          dragon_agate_blue: 1,
          clear_crystal: 1,
        },
      },
      {
        id: 'e2',
        label: '차분히 가라앉는 쪽',
        hint: '호흡이 느려지는 느낌',
        weights: {
          moonstone: 2,
          lavender_amethyst: 3,
          rose_quartz: 1,
        },
      },
      {
        id: 'e3',
        label: '작게라도 앞으로 미는 쪽',
        hint: '할 일 하나를 끝내는 힘',
        weights: {
          watermelon_redstone: 3,
          citrine: 2,
          peridot: 1,
        },
      },
      {
        id: 'e4',
        label: '말과 집중이 또렷해지는 쪽',
        hint: '시험·발표 전',
        weights: {
          dragon_agate_blue: 3,
          labradorite_black: 1,
          clear_crystal: 1,
        },
      },
      {
        id: 'e5',
        label: '묵은 걸 털고 환기하는 쪽',
        hint: '기분만 살짝 바꾸기',
        weights: {
          peridot: 3,
          citrine: 1,
          clear_crystal: 2,
        },
      },
    ],
  },
  {
    id: 'color',
    step: 3,
    title: '끌리는 빛깔은?',
    subtitle: '옷깃·소매 밖으로 보일 색을 고르세요.',
    options: [
      {
        id: 'c1',
        label: '거의 검은, 푸른 섬광이 스치는 돌',
        hint: '야간·블랙 톤 코디',
        weights: { labradorite_black: 3, dragon_agate_blue: 1 },
      },
      {
        id: 'c2',
        label: '우유빛, 흐린 광이 도는 돌',
        hint: '베이지·화이트 데일리',
        weights: { moonstone: 3, clear_crystal: 2, rose_quartz: 1 },
      },
      {
        id: 'c3',
        label: '연보라, 저녁 조명에 잠기는 돌',
        hint: '라벤더·그레이',
        weights: { lavender_amethyst: 3, rose_quartz: 1 },
      },
      {
        id: 'c4',
        label: '분홍–붉은 결이 있는 돌',
        hint: '따뜻한 포인트',
        weights: {
          watermelon_redstone: 3,
          rose_quartz: 2,
        },
      },
      {
        id: 'c5',
        label: '푸른 무늬 / 연두 / 호박 / 투명',
        hint: '나머지 네 빛깔',
        weights: {
          dragon_agate_blue: 2,
          peridot: 2,
          citrine: 2,
          clear_crystal: 1,
        },
      },
    ],
  },
  {
    id: 'time',
    step: 4,
    title: '주로 낄 시간대는?',
    subtitle: '하루 중 이 팔찌가 필요할 때를 고르세요.',
    options: [
      {
        id: 't1',
        label: '출근·외출, 사람 많은 낮',
        hint: '밖에서 쓰는 시간',
        weights: {
          labradorite_black: 2,
          dragon_agate_blue: 2,
          citrine: 2,
          watermelon_redstone: 1,
        },
      },
      {
        id: 't2',
        label: '저녁 이후, 잠들기 전',
        hint: '집에서의 늦은 시간',
        weights: {
          moonstone: 3,
          lavender_amethyst: 3,
          rose_quartz: 1,
        },
      },
      {
        id: 't3',
        label: '아침, 하루를 열 때',
        hint: '첫 할 일을 고르는 시각',
        weights: {
          watermelon_redstone: 2,
          peridot: 2,
          citrine: 2,
          clear_crystal: 1,
        },
      },
      {
        id: 't4',
        label: '주말, 정리하고 리셋할 때',
        hint: '구성을 다시 볼 여유',
        weights: {
          clear_crystal: 3,
          peridot: 2,
          rose_quartz: 1,
        },
      },
      {
        id: 't5',
        label: '시험·발표·중요한 대화 직전',
        hint: '짧게 집중이 필요할 때',
        weights: {
          dragon_agate_blue: 3,
          labradorite_black: 1,
          citrine: 1,
        },
      },
    ],
  },
  {
    id: 'mood',
    step: 5,
    title: '원하는 무드는?',
    subtitle: '완성된 팔찌가 남겼으면 하는 인상.',
    options: [
      {
        id: 'm1',
        label: '선이 분명하고 묵직한',
        hint: '과하지 않은 존재감',
        weights: {
          labradorite_black: 3,
          dragon_agate_blue: 1,
        },
      },
      {
        id: 'm2',
        label: '조용하고 흐린 광이 있는',
        hint: '밤에 잘 어울리는',
        weights: {
          moonstone: 3,
          lavender_amethyst: 2,
        },
      },
      {
        id: 'm3',
        label: '다정하고 부드러운',
        hint: '날카로움을 푸는',
        weights: {
          rose_quartz: 3,
          lavender_amethyst: 1,
          moonstone: 1,
        },
      },
      {
        id: 'm4',
        label: '작고 밝은 불씨 같은',
        hint: '움직이게 하는',
        weights: {
          watermelon_redstone: 2,
          citrine: 3,
          peridot: 2,
        },
      },
      {
        id: 'm5',
        label: '깨끗하고 비워 둔',
        hint: '어떤 돌과도 섞이는',
        weights: {
          clear_crystal: 3,
          peridot: 1,
          dragon_agate_blue: 1,
        },
      },
    ],
  },
] as const;
