import axios, { AxiosRequestConfig, AxiosResponse, Method } from 'axios';
import { AzureDevopsConfig } from '../../contexts/azure-devops/azure-devops.model';
import UtilService from '../util.service';
export default class ApiService {
    public static get<T>(endpoint: string, apiVersion: string, query?: { [key: string]: any }): Promise<T> {
        return this.callApi<any, T>('GET', endpoint, apiVersion, null, query);
    }

    public static post<T, P>(endpoint: string, data: T, apiVersion: string, query?: { [key: string]: any }): Promise<P> {
        return this.callApi<T, P>('POST', endpoint, apiVersion, data, query);
    }

    public static patch<T, P>(endpoint: string, data: T, apiVersion: string, query?: { [key: string]: any }): Promise<P> {
        return this.callApi<T, P>('PATCH', endpoint, apiVersion, data, query);
    }

    public static callApi<T, P>(
        method: Method,
        endpoint: string,
        apiVersion: string,
        data?: T,
        query?: { [key: string]: any }
    ): Promise<P> {
        const config = UtilService.getStorageObjectItem<AzureDevopsConfig>('@app:azure-config');
        if (!config?.endpoint || !config?.accessToken) {
            return new Promise((_, reject) => reject('Missing configuration'));
        }
        let baseURL = `${config.endpoint}/${endpoint}?api-version=${apiVersion}`;
        if (query) {
            let queryStr = UtilService.toQueryString(query);
            baseURL += `&${queryStr || ''}`;
        }
        const option: AxiosRequestConfig = {
            baseURL,
            method,
            headers: {
                Authorization: `Basic ${btoa(':' + config.accessToken)}`,
            },
            data,
        };

        if (data) {
            option.headers['content-type'] = 'application/json-patch+json';
        }

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
