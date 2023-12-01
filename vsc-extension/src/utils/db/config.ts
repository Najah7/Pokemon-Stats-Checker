import * as dotenv from 'dotenv';
import path from 'path';

// TODO: move it to other config file
// HACK: any better way to get project root path?
export const PROJECT_ROOT = path.join(__dirname, '..', '..', '..'); // プロジェクトのルートディレクトリ

export const DEV_DB_PATH = path.join(PROJECT_ROOT, 'data', 'pokemons.json');

dotenv.config();
export const DB_ENDPOINT: string | undefined = process.env.DB_ENDPOINT;
export const DB_API_KEY: string | undefined = process.env.DB_API_KEY;
export const DATA_SOURCE: string | undefined = process.env.DATA_SOURCE;

export const APP_DB: string = "pokemon-stats-checker";
export const POKEMON_COLLECTION: string = "pokemons";
export const SCORE_COLLECTION: string = "scores";

// NOTE: used by MongoDB query
export const INCLUDE: number = 1;
export const EXCLUDE: number = 0;

export const MAX_POKEMON_ID = 151; // 第1世代のポケモンの数が151匹