const fs = require('fs');
const axios = require('axios');
const path = require('path');

// HACK: @などでルートディレクトリを指定できるように
import { Pokemon, Stats, StatName } from '../../types/pokemons';

// HACK: スマートな方法があれば修正
const PROJECT_ROOT = path.join(__dirname, '..', '..'); // プロジェクトのルートディレクトリ
// HACK: envとかで管理したい
const MAX_POKEMON_ID = 151; // 第1世代のポケモンの数が151匹

const fetchPokemons = async () => {
    let pokemonList: Pokemon[] = [];
    for (let i = 1; i <= MAX_POKEMON_ID; i++) {
        try {
            const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${i}`);
            const pokemonData = response.data;
            const id = pokemonData.id;
            const name = pokemonData.name;
            const stats = pokemonData.stats.reduce((acc: any, stat: any) => {
                const statName = stat.stat.name as StatName;
                acc[statName] = stat.base_stat;
                return acc;
            }, {} as Stats);
            const pokemon = new_pokemon(id, name, stats);
            pokemonList.push(pokemon);
        } catch (error: any) {
            console.error('[Error] Failed to fetch pokemon data at id:', i);
            console.error(error.message);
        }
        // NOTE:事前取得なので、安全性を優先して1秒にした。
        await sleep(100);
    }
    return pokemonList;
}

const new_pokemon = (id: number, name: string, stats: Stats): Pokemon => {
    const pokemon = {
        id: id,
        name: name,
        stats: stats
    };
    return pokemon;
}

const savePokemonDataToJson = (pokemonList: any[], filePath: string) => {
    const jsonContent = JSON.stringify(pokemonList, null, 2);

    fs.writeFile(filePath, jsonContent, 'utf8', (err: any) => {
        if (err) {
            console.error('ファイルの書き込み中にエラーが発生しました:', err);
            return;
        }
        console.log('ポケモンデータがファイルに保存されました:', filePath);
    });
};

async function sleep(ms: number) {
    await new Promise(resolve => setTimeout(resolve, ms));
}

if (require.main === module) {
    if (!fs.existsSync(`${PROJECT_ROOT}/data`)) {
        fs.mkdirSync('`${PROJECT_ROOT}/data`');
    }
    (async () => {
        const pokemonList = await fetchPokemons();
        savePokemonDataToJson(pokemonList, `${PROJECT_ROOT}/data/pokemons.json`);
    })();
}