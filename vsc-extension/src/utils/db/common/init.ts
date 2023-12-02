
import axios, { AxiosRequestConfig } from 'axios';

import * as env from '../config';

const initDB = async (collection: string, documents: object[]): Promise<void> => {

    const data = JSON.stringify({
        "collection": collection,
        "database": env.DB,
        "dataSource": env.DATA_SOURCE,
        "documents": documents,
    });

    const config: AxiosRequestConfig = {
        method: 'post',
        url: `${env.DB_ENDPOINT}/action/insertMany`,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Request-Headers': '*',
            'api-key': env.DB_API_KEY,
        },
        data: data
    };

    console.log(`Inserting ${collection} data to ${collection} DB...`);
    await axios(config)
        .then(function (response) {
            console.log(`Successfully inserted ${collection} data to ${collection} DB!`);
            console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
            console.log(`Failed to insert ${collection} data to ${collection}!`);
            console.log(error);
        });
}

export { initDB };