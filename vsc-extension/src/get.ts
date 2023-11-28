import * as vscode from 'vscode';
import * as dotenv from 'dotenv';
import * as path from 'path';
import axios from 'axios';

dotenv.config({ path: path.join(__dirname, '.env') });
console.log(path.join(__dirname, '.env'));

const bucketName = process.env.bucket_name;
const region = process.env.region;

export function getUrl() {
    // グラフURLを取得
    const graphUrl = `http://${bucketName}.s3.${region}.amazonaws.com/graph.png`;
    vscode.window.showInformationMessage(graphUrl);
}

export async function getPokemon(h: number, a: number, b: number, c: number, d: number, s: number) {
    var previousError = 100000;
    var bestPokemonId = 0;

    // 第一世代のポケモンから種族値特徴が近いポケモンを探索
    for (let i = 1; i <= 151; i++) {
        // デバッグ
        console.log("check No.", i);

        try {
            const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${i}`);
            const pokemonData = response.data;

            // 種族値
            const baseStats = pokemonData.stats.map((stat: any) => {
                return {
                    name: stat.stat.name,
                    value: stat.base_stat
                };
            });

            var currentError = 0;
            for (let j = 0; j < baseStats.length; j++) {
                currentError += (baseStats[j].value - [h, a, b, c, d, s][j]) ** 2;
            }

            if (currentError < previousError) {
                previousError = currentError;
                bestPokemonId = i;
            }
        } catch (error: any) {
            console.error('エラーが発生しました:', error.message);
        }
    }

    try {
        // 最後に最も種族値特徴が近いポケモンの名前を出力
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${bestPokemonId}`);
        const pokemonData = response.data;
        const speciesResponse = await axios.get(pokemonData.species.url);
        const pokemon = speciesResponse.data.names.find((name: any) => name.language.name === 'ja').name;

        const baseStats = pokemonData.stats.map((stat: any) => {
            return {
                name: stat.stat.name,
                value: stat.base_stat
            };
        });

        // デバッグ
        console.log('最も種族値特徴が近いポケモン:', pokemon);
        console.log(`${pokemon}の種族値:`, baseStats);
        vscode.window.showInformationMessage(`あなたの種族値特徴と近いポケモンは${pokemon}!`);

    } catch (error: any) {
        console.error('エラーが発生しました:', error.message);
    }
}