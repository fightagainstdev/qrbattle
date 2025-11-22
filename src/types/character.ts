export enum AttackDirection {
  F = "前方", // 1 grid
  A = "周围", // 4 grid
  C = "十字", // 8 grid
}
export const DIRECTION_TIER_MAP = {
  [AttackDirection.F]: 2,
  [AttackDirection.A]: 1,
  [AttackDirection.C]: 0,
};

export enum AttackType {
  N = "普通",
  P = "穿透",
}

export type CharacterProps = {
  health: number;
  shield: number;
  attack: number;
  hitRate: number;
  critical: number;
  attackDirection: AttackDirection;
  attackType: AttackType;
  hitBack: number;
};
export type OptionalCharacterProps = {
  [P in keyof CharacterProps]?: CharacterProps[P];
};
