import { AzureDevopsConfig } from './../contexts/azure-devops.context';
import axios, { AxiosRequestConfig } from 'axios';

export default class AzureDevopsService {
    private static _config: AzureDevopsConfig;
    public static init(config: AzureDevopsConfig) {
        this._config = config;
    }
    public static getProjects() {
        const option: AxiosRequestConfig = {
            headers: {
                Authorization: `Basic ${btoa(':' + this._config.accessToken)}`,
            },
        };
        return axios.get(`${this._config.endpoint}/_apis/projects?api-version=2.0`, option).then((r) => r.data);
    }
}
