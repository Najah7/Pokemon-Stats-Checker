import { BaseStats } from "./stat";

type PokemonColor = {
    fillColor: string;
    lineColor: string;
}

type Pokemon = {
    pokemonId: number;
    name: string;
    baseStats: BaseStats;
    color: PokemonColor;
}

type PokemonId = number;

type Pokemons = Map<PokemonId, Pokemon>;

export { PokemonColor, Pokemon, Pokemons };