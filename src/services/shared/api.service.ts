import axios, { AxiosRequestConfig, AxiosResponse, Method } from 'axios';
import { AzureDevopsConfig } from '../../contexts/azure-devops.context';
import UtilService from '../util.service';

export default class ApiService {
    public static get<T>(endpoint: string, query: string): Promise<T> {
        return this.callApi<any, T>('GET', endpoint, query);
    }

    public static post<T, P>(endpoint: string, data: T, query: string): Promise<P> {
        return this.callApi<T, P>('POST', endpoint, query, data);
    }

    public static callApi<T, P>(method: Method, endpoint: string, query: string, data?: T): Promise<P> {
        const config = UtilService.getStorageObjectItem<AzureDevopsConfig>('@app:azure-config');
        if (!config?.endpoint || !config?.accessToken) {
            return new Promise((_, reject) => reject('Missing configuration'));
        }
        const option: AxiosRequestConfig = {
            baseURL: `${config.endpoint}/${endpoint}?${query}`,
            method,
            headers: {
                Authorization: `Basic ${btoa(':' + config.accessToken)}`,
            },
            data,
        };
        return axios.request<T, AxiosResponse<P>>(option).then((response) => {
            return new Promise<P>((resolve, reject) => {
                if (response.status === 200) {
                    return resolve(response.data);
                }
                return reject('Fail to call api');
            });
        });
    }
}
