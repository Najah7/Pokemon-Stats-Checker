const fs = require('fs');
const axios = require('axios');
const path = require('path');

import { Pokemon } from '../../types/pokemons';

// HACK: スマートな方法があれば修正
const PROJECT_ROOT = path.join(__dirname, '..', '..', '..'); // プロジェクトのルートディレクトリ
const DB_PATH = path.join(PROJECT_ROOT, 'data', 'pokemons.json'); // ポケモンのデータベースのパス
// HACK: envとかで管理したい
const MAX_POKEMON_ID = 151; // 第1世代のポケモンの数が151匹

let pokemonList: Pokemon[] = [];

const readPokemonDataFromJson = (): Pokemon[] => {
    if (pokemonList.length === 0) {
        const data = fs.readFileSync(DB_PATH, 'utf8');
        pokemonList = JSON.parse(data);
    }
    return pokemonList;
}

const readPokemons = (): Pokemon[] => {
    readPokemonDataFromJson();
    return pokemonList;
}

const readPokemonById = (id: number): Pokemon => {
    if (pokemonList.length === 0) {
        readPokemonDataFromJson();
    }
    const pokemon = pokemonList.find((pokemon: Pokemon) => pokemon.id === id);
    if (!pokemon) {
        console.info(`[hint] We support only 1st generation pokemon between id 1 and ${MAX_POKEMON_ID}`);
        throw new Error(`No pokemon found with id: ${id}`);
    }
    return pokemon;
}

const readPokemonByName = (name: string): Pokemon => {
    if (pokemonList.length === 0) {
        readPokemonDataFromJson();
    }
    const pokemon = pokemonList.find((pokemon: Pokemon) => pokemon.name === name);
    if (!pokemon) {
        throw new Error(`No pokemon found with name: ${name}`);
    }
    return pokemon;
}

export { readPokemons, readPokemonById, readPokemonByName };



