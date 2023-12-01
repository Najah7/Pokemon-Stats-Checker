import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

import { HasIdOrName } from '../../../types/utils';

const fetchData = async <T extends HasIdOrName>(
    config: AxiosRequestConfig,
    dataMap: Map<number, T>,
    successMessage: string,
    errorMessage: string
): Promise<void> => {
    await axios(config)
        .then(function (response: AxiosResponse) {
            const dataList = response.data.documents;
            dataMap.clear();
            dataList.forEach((data: T, index: number) => {
                if ('id' in data && data.id !== undefined) {
                    dataMap.set(data.id, data);
                } else if ('name' in data) {
                    // Assume name is unique and use a unique index if required
                    dataMap.set(index, data);
                }
            });
            console.log(successMessage);
        })
        .catch(function (error: AxiosError) {
            console.log(error);
            throw new Error(errorMessage);
        });
};

export { fetchData };