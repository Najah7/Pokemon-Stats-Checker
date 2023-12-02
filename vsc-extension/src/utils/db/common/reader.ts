import { newConfig } from '../common/request';
import { isCached } from '../common/helpers';
import { newFindParams } from '../common/request';
import { fetchAllData, FetchTypes } from '../common/fetch';
import { 
    HasPokemonId,
    HasUserName
} from '../../../types/utils/db/ids';

const readAllData = async <T extends FetchTypes>(
    collection: string,
    projections_keys: string[],
    cache: Map<number, T> | Array<T>
    ): Promise<Map<number, T> | Array<T>> => {
        if (isCached(cache)) return cache;
        const params = newFindParams(collection, {}, ...projections_keys);
        const config = newConfig('post', 'find', params);
        await fetchAllData<T>(
            config,
            cache,
            `Successfully fetched data from ${collection}!`,
            `Failed to fetch data from ${collection}!`);
        return cache;
}

const readDataById = async <T extends HasPokemonId>(
    collection: string,
    id: number,
    projections_keys: string[],
    cache: Map<number, T>
    ): Promise<T> => {
    if (!isCached(cache)) {
        const params = newFindParams(collection, {}, ...projections_keys);
        const config = newConfig('post', 'find', params);
        await fetchAllData<T>(config, cache, 'Successfully fetched data from DB!', 'Failed to fetch data from DB!');
    }
    const data = cache.get(id);
    if (!data) throw new Error(`No data found with id: ${id}`);
    return data;
}

type HasPokemonIdOrUserName =  HasPokemonId | HasUserName;

const readDataByName = async <T extends HasPokemonIdOrUserName>(
    collection: string,
    name: string,
    projections_keys: string[],
    cache: Map<number, T> | Array<T>
    ): Promise<T> => {
    if (!isCached(cache)) {
        const params = newFindParams(collection, {}, ...projections_keys);
        const config = newConfig('post', 'find', params);
        await fetchAllData<T>(config, cache, 'Successfully fetched data from DB!', 'Failed to fetch data from DB!');
    }
    let data: T | undefined;
    cache.forEach((item: T) => {
        if ('userName' in item && item.userName === name) {
            data = item;
        } else if ('name' in item && item.name === name) {
            data = item;
        }
    });
    if (!data) throw new Error(`No ${collection} found with name: ${name}`);
    return data;
}

export { readAllData, readDataById, readDataByName };