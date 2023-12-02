type Projection = {[key: string]: number};

type FindParams = {
    collection: string;
    database: string;
    dataSource: string | undefined; // it's environment variable
    filter: object;
    projection: Projection;
}

type InsertParams = {
    collection: string;
    database: string;
    dataSource: string | undefined; // it's environment variable
    document: object;
}

type UpdateParams = {
    collection: string;
    database: string;
    dataSource: string | undefined; // it's environment variable
    filter: object;
    update: object;
}

type DeleteParams = {
    collection: string;
    database: string;
    dataSource: string | undefined; // it's environment variable
    filter: object;
}

export {
    Projection,
    FindParams,
    InsertParams,
    UpdateParams,
    DeleteParams
}