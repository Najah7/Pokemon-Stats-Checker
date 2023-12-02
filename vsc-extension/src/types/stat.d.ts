type BaseStats = {
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
}

type StatsList = BaseStats[];

export { BaseStats, StatsList };