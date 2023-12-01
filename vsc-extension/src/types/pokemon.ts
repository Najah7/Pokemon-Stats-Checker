import { Stats } from "./stat";

type Pokemon {
    id: number;
    name: string;
    stats: Stats;
}

type PokemonId = number;

type Pokemons = Map<PokemonId, Pokemon>;

export { Pokemon, Pokemons };