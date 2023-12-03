const fs = require("fs");
const axios = require("axios");
const path = require("path");

// HACK: @などでルートディレクトリを指定できるように
import { PokemonType, Stats, StatName } from "../../types/pokemons";

// HACK: スマートな方法があれば修正
const PROJECT_ROOT = path.join(__dirname, "..", "..", ".."); // プロジェクトのルートディレクトリ
// HACK: envとかで管理したい
const MAX_POKEMON_ID = 151; // 第1世代のポケモンの数が151匹

const fetchPokemons = async () => {
  let pokemonList: PokemonType[] = [];
  console.log("ポケモンデータを取得中...");
  for (let i = 1; i <= MAX_POKEMON_ID; i++) {
    try {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${i}`
      );
      const pokemonData = response.data;
      const id = pokemonData.id;
      const name = await toJapaneseWithAPICall(pokemonData.species.url);
      const stats = pokemonData.stats.reduce((acc: any, stat: any) => {
        const statName = stat.stat.name as StatName;
        acc[statName] = stat.base_stat;
        return acc;
      }, {} as Stats);
      const pokemon = newPokemon(id, name, stats);
      pokemonList.push(pokemon);
    } catch (error: any) {
      console.error("[Error] Failed to fetch pokemon data at id:", i);
      console.error(error.message);
    }
    // NOTE:事前取得なので、安全性を優先して0.1秒にした。
    await sleep(100);
    process.stdout.write("."); // just for UX
  }
  process.stdout.write("\n"); // just for UX
  return pokemonList;
};

// @param speciesUri: string - ポケモンの種類のURI (ex: https://pokeapi.co/api/v2/pokemon-species/25/)
// NOTE: idからポケモンのおおむねの情報を取得することができるAPIに、日本語表記が含まれるspeciesのAPIのURIが含まれているので、引数をURIにしている。
const toJapaneseWithAPICall = async (speciesUri: string) => {
  const speciesResponse = await axios.get(speciesUri);
  const jp_name = speciesResponse.data.names.find(
    (name: any) => name.language.name === "ja"
  ).name;
  return jp_name;
};

const newPokemon = (id: number, name: string, stats: Stats): PokemonType => {
  const pokemon = {
    pokemonId: id,
    name: name,
    baseStats: stats,
    color: {
      fillColor: "#000000",
      lineColor: "#000000",
    },
  };
  return pokemon;
};

const savePokemonDataToJson = (pokemonList: any[], filePath: string) => {
  const jsonContent = JSON.stringify(pokemonList, null, 2);

  fs.writeFile(filePath, jsonContent, "utf8", (err: any) => {
    if (err) {
      console.error("ファイルの書き込み中にエラーが発生しました:", err);
      return;
    }
    console.log("ポケモンデータがファイルに保存されました:", filePath);
  });
};

async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

if (require.main === module) {
  if (!fs.existsSync(`${PROJECT_ROOT}/data`)) {
    fs.mkdirSync(`${PROJECT_ROOT}/data`);
  }
  (async () => {
    const pokemonList = await fetchPokemons();
    savePokemonDataToJson(pokemonList, `${PROJECT_ROOT}/data/pokemons.json`);
  })();
}
