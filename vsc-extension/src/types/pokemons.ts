interface PokemonType {
  pokemonId: number;
  name: string;
  baseStats: Stats;
  color: Color;
}

type StatName =
  | "hp"
  | "attack"
  | "defense"
  | "specialAttack"
  | "specialDefense"
  | "speed";

interface BaseStats {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
}

interface Color {
  fillColor: string;
  lineColor: string;
}

// NOTE: Pick is just for flexibility. never mind.
type Stats = Pick<BaseStats, StatName>;

export { PokemonType, StatName, Stats, Color };
