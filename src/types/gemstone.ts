/** 원석·퀴즈·팔찌 빌더에서 공유하는 엄격한 유니언/인터페이스 */

export type GemstoneId =
  | 'labradorite_black'
  | 'moonstone'
  | 'lavender_amethyst'
  | 'watermelon_redstone'
  | 'rose_quartz'
  | 'dragon_agate_blue'
  | 'peridot'
  | 'citrine'
  | 'clear_crystal';

export type GemstoneTier = 'main' | 'base';

export type BraceletPattern = 'solid' | 'accent3' | 'alternate' | 'custom';

export type DonutMetal = 'none' | 'silver' | 'gold';

/** 도넛 스페이서 간격 */
export type DonutSpacing = 'accent' | 'every3' | 'all';

export type AppView = 'intro' | 'quiz' | 'result' | 'catalog';

export type QuestionId =
  | 'release'
  | 'energy'
  | 'color'
  | 'time'
  | 'mood';

/** 자유 커스텀 브러시 */
export type CustomBrush =
  | { readonly kind: 'gem'; readonly gemId: GemstoneId }
  | { readonly kind: 'capOn' }
  | { readonly kind: 'capOff' };

export interface GemstoneGradientStop {
  readonly offset: string;
  readonly color: string;
}

/** 원석 다층 radialGradient 정의 */
export interface GemstoneVisual {
  readonly base: string;
  readonly stops: readonly GemstoneGradientStop[];
  readonly rim: string;
}

export interface Gemstone {
  readonly id: GemstoneId;
  readonly nameKo: string;
  readonly tier: GemstoneTier;
  readonly price: number;
  readonly number: string;
  readonly keywords: readonly string[];
  readonly description: string;
  readonly ritual: string;
  readonly cleanse: string;
  readonly visual: GemstoneVisual;
}

export interface QuestionOption {
  readonly id: string;
  readonly label: string;
  readonly hint: string;
  readonly weights: Partial<Record<GemstoneId, number>>;
}

export interface Question {
  readonly id: QuestionId;
  readonly step: number;
  readonly title: string;
  readonly subtitle: string;
  readonly options: readonly QuestionOption[];
}

export type AnswerMap = Partial<Record<QuestionId, string>>;

export interface RecommendResult {
  readonly gemstone: Gemstone;
  readonly scores: Readonly<Record<GemstoneId, number>>;
  readonly tiedIds: readonly GemstoneId[];
}

/** 18알 슬롯 — 원석 + 꽃 비즈 캡 */
export interface BeadSlot {
  readonly gemId: GemstoneId;
  readonly hasFlowerCap: boolean;
}

export interface BraceletConfig {
  readonly primaryId: GemstoneId;
  readonly secondaryId: GemstoneId;
  readonly pattern: BraceletPattern;
  readonly slots: readonly BeadSlot[];
  readonly donutMetal: DonutMetal;
  readonly donutSpacing: DonutSpacing;
}

export interface OrderCopyPayload {
  readonly config: BraceletConfig;
  readonly price: number;
}
