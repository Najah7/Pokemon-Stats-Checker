import { Pokemon, Pokemons } from '../../../types/pokemon';
import { readAllData, readDataById, readDataByName } from '../common/reader';

import * as env from '../config';

let cashedPokemons: Map<number, Pokemon> = new Map<number, Pokemon>();

const activePokemonsCache = async (): Promise<void> => {
    cashedPokemons = await readPokemons();
}

const readPokemons = async (): Promise<Pokemons> => {
    const ps: Pokemons = await readAllData<Pokemon>(
        env.POKEMON_COLLECTION,
        ['id', 'name', 'stats'],
        cashedPokemons
    );
    return ps;
}

// HACK: if it's possible, sum up readPokemonById and readPokemonByName
const readPokemonById = async (id: number): Promise<Pokemon> => {
    const p: Pokemon = await readDataById<Pokemon>(
        env.POKEMON_COLLECTION,
        id,
        ['id', 'name', 'stats'],
        cashedPokemons
    );
    return p;
}

const readPokemonByName = async (name: string): Promise<Pokemon> => {
    const p: Pokemon = await readDataByName<Pokemon>(
        env.POKEMON_COLLECTION,
        name,
        ['id', 'name', 'stats'],
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