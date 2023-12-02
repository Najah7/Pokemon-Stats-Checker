import { newConfig } from '../common/request';
import { isCached } from '../common/helpers';
import { newFindParams } from '../common/request';
import { fetchData } from '../common/fetch';
import { HasIdOrName, HasName, HasId } from '../../../types/utils';

const readAllData = async <T extends HasIdOrName>(
    collection: string,
    projections_keys: string[],
    cache: Map<number, T>
    ): Promise<Map<number, T>> => {
        if (isCached(cache)) return cache;
        const params = newFindParams(collection, {}, ...projections_keys);
        const config = newConfig('post', 'find', params);
        await fetchData<HasIdOrName>(
            config,
            cache,
            `Successfully fetched data from ${collection}!`,
            `Failed to fetch data from ${collection}!`);
        return cache;
}

const readDataById = async <T extends HasId>(
    collection: string,
    id: number,
    projections_keys: string[],
    cache: Map<number, T>
    ): Promise<T> => {
    if (!isCached(cache)) {
        const params = newFindParams(collection, {}, ...projections_keys);
        const config = newConfig('post', 'find', params);
        await fetchData<T>(config, cache, 'Successfully fetched data from DB!', 'Failed to fetch data from DB!');
    }
    const data = cache.get(id);
    if (!data) throw new Error(`No data found with id: ${id}`);
    return data;
}

const readDataByName = async <T extends HasName>(
    collection: string,
    name: string,
    projections_keys: string[],
    cache: Map<number, T>
    ): Promise<T> => {
    if (!isCached(cache)) {
        const params = newFindParams(collection, {}, ...projections_keys);
        const config = newConfig('post', 'find', params);
        await fetchData<T>(config, cache, 'Successfully fetched data from DB!', 'Failed to fetch data from DB!');
    }
    const data = Array.from(cache.values()).find(data => data.name === name);
    if (!data) throw new Error(`No data found with name: ${name}`);
    return data;
}

export { readAllData, readDataById, readDataByName };