import axios, { AxiosRequestConfig, AxiosResponse, AxiosError, Axios } from 'axios';

import { HasPokemonId, HasUserName } from '../../../types/utils/db/ids';
import { config } from 'yargs';

const updateCache = <T extends FetchTypes>(
    dataList: T[],
    cache: Map<number, T> | T[]
): void => {
    // initialize cache
    Array.isArray(cache) ? cache.length = 0 : cache.clear();
    dataList.forEach((data: T, index: number) => {
        if (('pokemonId' in data && data.pokemonId !== undefined)) {
            if (Array.isArray(cache)) cache[data.pokemonId] = data;
            else cache.set(data.pokemonId, data);
        } else {
            console.log(dataList)
            console.log(config)
            if (Array.isArray(cache)) cache[index] = data;
            else throw new Error('Invalid cache type');
        }
    });
};

type NoIdentifier = {};

type FetchTypes = HasPokemonId | HasUserName | NoIdentifier;

const fetchAllData = async <T extends FetchTypes>(
    config: AxiosRequestConfig,
    cache: Map<number, T> | Array<T>,
    successMessage: string,
    errorMessage: string
): Promise<void> => {
    try {
        const response: AxiosResponse = await axios(config);
        const dataList: T[] = response.data.documents;
        updateCache(dataList, cache);
        console.log(successMessage);
    } catch (error) {
        console.log(config);
        console.log(error);
        throw new Error(errorMessage);
    }
};

const fetchData = async <T>(
    config: AxiosRequestConfig
): Promise<T> => {
    try {
        const response: AxiosResponse = await axios(config);
        const data: T = response.data;
        return data;
    } catch (error) {
        console.log(error);
        throw new Error("Failed to fetch data from DB!");
    }
};


export { fetchAllData, FetchTypes };