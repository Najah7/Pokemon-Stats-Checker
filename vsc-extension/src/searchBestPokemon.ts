import { Stats } from "./types/pokemons";
import { pokemons } from "./start";

export const searchBestPokemon = (stats: Stats) => {
  if (pokemons.length === 0) {
    throw new Error("pokemons is empty");
  }
  if (stats === undefined) {
    throw new Error("stats is undefined");
  }
  let previousError = 100000;
  let bestPokemonId = 0;

  pokemons.forEach((pokemon) => {
    console.log("check No.", pokemon.pokemonId, pokemon.name);

    let currentError = 0;
    const baseStats = pokemon.baseStats;
    Object.keys(baseStats).forEach((key) => {
      const stat = key as keyof Stats;
      currentError += (baseStats[stat] - stats[stat]) ** 2;
    });

    if (currentError < previousError) {
      previousError = currentError;
      bestPokemonId = pokemon.pokemonId;
    }
  });

  const bestPokemon = pokemons.find(
    (pokemon) => pokemon.pokemonId === bestPokemonId
  );
  return bestPokemon;
};
