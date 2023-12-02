require('dotenv').config();

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWD;
const serverName = process.env.DB_SERVER;

import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = `mongodb+srv://${dbUser}:${dbPassword}@${serverName}/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

export { client };