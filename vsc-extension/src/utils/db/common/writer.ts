import { newConfig, newDeleteParams, newInsertParams, newUpdateParams } from "./request";;
import { pushData } from "./push";
import { HasIdOrName } from "../../../types/utils";

const insertData = async <T extends HasIdOrName>(
    collection: string,
    insertedData: T,
): Promise<void> => {
    const params = newInsertParams(collection, insertedData);
    const config = newConfig('post', 'insertOne', params);
    await pushData(config)
}

const updateData = async <T extends HasIdOrName>(
    collection: string,
    updateData: T,
): Promise<void> => {
    let filter = {};
    if ('id' in updateData&& updateData.id !== undefined) {
        filter = { id: updateData.id };
    } else if ('name' in updateData) {
        filter = { name: updateData.name };
    }
    const params = newUpdateParams(collection, filter, updateData)
    const config = newConfig('post', 'updateOne', params);
    await pushData(config);
}

const deleteData = async (
    collection: string,
    filter: { [key: string]: any },
): Promise<void> => {
    const params = newDeleteParams(
        collection,
        filter,
    );
    const config = newConfig('post', 'deleteOne', params);
    await pushData(config);
}

export { insertData, updateData, deleteData };