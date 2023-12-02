const isCached = (cashe: Map<number, any> | Array<any>): boolean => {
    if (cashe instanceof Array) {
        return cashe.length !== 0;
    }
    else if (cashe instanceof Map) {
        return cashe.size !== 0;
    }
    else {
        throw new Error("Invalid cache type");
    }
};

export { isCached };

