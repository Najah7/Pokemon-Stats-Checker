// TODO: Remove this file after sharing the code with team members.
import axios, { AxiosRequestConfig } from 'axios';
import * as env from './config';


const data = JSON.stringify({
  "collection": env.POKEMON_COLLECTION,
  "database": env.DB,
  "dataSource": env.DATA_SOURCE,
  "projection": {
    "pokemonId": env.INCLUDE,
    "name": env.INCLUDE,
    "baseStats": env.INCLUDE,
    "color": env.INCLUDE,
  },
});

const config: AxiosRequestConfig = {
    method: 'post',
    url: `${env.DB_ENDPOINT}/action/findOne`,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Request-Headers': '*',
        'api-key': env.DB_API_KEY,
    },
    data: data
};

axios(config)
    .then(function (response) {
        console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
        console.log(error);
    });
