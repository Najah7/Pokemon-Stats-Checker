import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

import {
    Projection,
    FindParams,
    InsertParams,
    UpdateParams,
    DeleteParams
} from './params';
import * as env from '../config';

const newProjection = (...args: string[]): Projection => {
    const p: Projection = args.reduce((p: Projection, key: string) => {
        p[key] = env.INCLUDE;
        return p;
    }, {});
    return p;
}

const newFindParams = (
    collection: string,
    filter: object,
    ...projections_keys: string[]
    ): FindParams => {
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
    ): InsertParams => {
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
    ): UpdateParams => {
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
    ): DeleteParams => {
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