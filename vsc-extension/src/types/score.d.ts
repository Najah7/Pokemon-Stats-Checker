import { BaseStats } from "./stat";

// HACK: This is temporary solution
type Score = {
    userName: string;
    baseStats: BaseStats;
}

type Scores = Score[];

export { Score, Scores };