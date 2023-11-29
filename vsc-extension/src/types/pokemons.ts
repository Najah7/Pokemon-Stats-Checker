interface Pokemon {
    id: number;
    name: string;
    stats: Stats;
}

type StatName = 'hp' | 'attack' | 'defense' | 'special-attack' | 'special-defense' | 'speed';

interface BaseStats {
    hp: number;
    attack: number;
    defense: number;
    'special-attack': number;
    'special-defense': number;
    speed: number;
}

// NOTE: Pick is just for flexibility. never mind.
type Stats = Pick<BaseStats, StatName>;

export { Pokemon, StatName, Stats };