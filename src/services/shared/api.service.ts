import axios, { AxiosRequestConfig, AxiosResponse, Method } from 'axios';
import { AzureDevopsConfig } from '../../contexts/azure-devops.context';
import UtilService from '../util.service';

export default class ApiService {
    public static get<T>(endpoint: string): Promise<T> {
        return this.callApi<any, T>('GET', endpoint);
    }

    public static post<T, P>(endpoint: string, data: T): Promise<P> {
        return this.callApi<T, P>('POST', endpoint, data);
    }

    public static callApi<T, P>(method: Method, endpoint: string, data?: T): Promise<P> {
        const config = UtilService.getStorageItem<AzureDevopsConfig>('@app:azure-config');
        if (!config?.endpoint || !config?.accessToken) {
            return new Promise((_, reject) => reject('Missing configuration'));
        }
        const option: AxiosRequestConfig = {
            baseURL: `${config.endpoint}/_apis/${endpoint}?api-version=6.0`,
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
