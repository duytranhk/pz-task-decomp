import ApiService from '../api.service';
import { DevopsProject } from './azure-devops.models';

export default class AzureDevopsClient {
    public static getProjects() {
        return ApiService.get<AzureDevopsResponse<DevopsProject[]>>('projects');
    }
}

export interface AzureDevopsResponse<T> {
    count: number;
    value: T;
}
