import { Pokemon, Pokemons } from '../../../types/pokemon';
import { readAllData, readDataById, readDataByName } from '../common/reader';

import * as env from '../config';

let cashedPokemons: Map<number, Pokemon> = new Map<number, Pokemon>();

const activePokemonsCache = async (): Promise<void> => {
    cashedPokemons = await readPokemons();
}

const readPokemons = async (): Promise<Pokemons> => {
    const data = await readAllData<Pokemon>(
        env.POKEMON_COLLECTION,
        ['pokemonId', 'name', 'baseStats', 'color'],
        cashedPokemons
    );
    // HACK: readAllData returns Map<number, T> | Array<T>, and I have no idea how to handle it
    let ps: Pokemons;
    if (data instanceof Map) {
        ps = data;
    } else {
        ps = new Map<number, Pokemon>();
        data.forEach((p: Pokemon) => {
            ps.set(p.pokemonId, p);
        });
    }
    return ps;
}

// HACK: if it's possible, sum up readPokemonById and readPokemonByName
const readPokemonById = async (pokemonId: number): Promise<Pokemon> => {
    const p: Pokemon = await readDataById<Pokemon>(
        env.POKEMON_COLLECTION,
        pokemonId,
        ['pokemonId', 'name', 'baseStats', 'color'],
        cashedPokemons
    );
    return p;
}

const readPokemonByName = async (name: string): Promise<Pokemon> => {
    const p: Pokemon = await readDataByName<Pokemon>(
        env.POKEMON_COLLECTION,
        name,
        ['pokemonId', 'name', 'baseStats', 'color'],
        cashedPokemons
    );
    return p;
}

export {
    activePokemonsCache,
    readPokemons,
    readPokemonById,
    readPokemonByName
};