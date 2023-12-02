import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

const pushData = async (
    config: AxiosRequestConfig,
): Promise<any> => {
    await axios(config)
        .then(function (response: AxiosResponse) {
            return response.data;
        })
        .catch(function (error: AxiosError) {
            console.log(config);
            throw new Error(error.message);
        });
}

export { pushData };
