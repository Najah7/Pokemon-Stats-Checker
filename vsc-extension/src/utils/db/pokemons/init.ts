import fs from 'fs';

import { Pokemon } from '../../../types/pokemon';
import * as env from '../config';
import { initDB } from '../common/init';

const pokemonsJson = (db_path: string): Pokemon[] => {
    const data = fs.readFileSync(db_path, 'utf8');
    return JSON.parse(data);
}

if (require.main === module) {
    const pokemons = pokemonsJson(env.POKEMON_LOCAL_DB);
    initDB(env.POKEMON_COLLECTION, pokemons);
}