import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

import * as env from '../config';

const newProjection = (...args: string[]): {[key: string]: number} => {
    return args.reduce((projection: {[key: string]: number}, key: string) => {
        projection[key] = env.INCLUDE;
        return projection;
    }, {});
}

const newFindParams = (collection: string, filter: object,...projections_keys: string[]): {[key: string]: any} => {
    const projection = newProjection(...projections_keys);
    return {
        "collection": collection,
        "database": env.DB,
        "dataSource": env.DATA_SOURCE,
        "filter": filter,
        "projection": projection
    }
}

const newInsertParams = (
    collection: string,
    document: object
    ): {[key: string]: any} => {
        return {
            "collection": collection,
            "database": env.DB,
            "dataSource": env.DATA_SOURCE,
            "document": document
        }
}

const newUpdateParams = (
    collection: string,
    filter: object,
    update: object
    ): {[key: string]: any} => {
        return {
            "collection": collection,
            "database": env.DB,
            "dataSource": env.DATA_SOURCE,
            "filter": filter,
            "update": update
        }
}

const newDeleteParams = (
    collection: string,
    filter: object
    ): {[key: string]: any} => {
        return {
            "collection": collection,
            "database": env.DB,
            "dataSource": env.DATA_SOURCE,
            "filter": filter
        }
}



const newConfig = (
    method: string,
    action: string,
    params: object
    ): AxiosRequestConfig => {
        return {
            method: method,
            url: `${env.DB_ENDPOINT}/action/${action}`,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Request-Headers': '*',
                'api-key': env.DB_API_KEY,
            },
            data: params
        };
}

export {
    newProjection,
    newFindParams,
    newInsertParams,
    newUpdateParams,
    newDeleteParams,
    newConfig
}