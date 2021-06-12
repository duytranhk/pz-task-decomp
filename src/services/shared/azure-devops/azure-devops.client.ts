import ApiService from '../api.service';
import { DevopsProject, DevopsIteration, DevopsTaskBoardWorkItem, DevopsTeams } from './azure-devops.models';

export default class AzureDevopsClient {
    public static getProjects() {
        return ApiService.get<AzureDevopsResponse<DevopsProject[]>>('_apis/projects', 'api-version=6.0');
    }

    public static getTeams() {
        return ApiService.get<AzureDevopsResponse<DevopsTeams[]>>('_apis/teams', '$mine=true&api-version=6.1-preview.3');
    }

    public static getIterations(projectId: string, teamId: string) {
        return ApiService.get<AzureDevopsResponse<DevopsIteration[]>>(
            `${projectId}/${teamId}/_apis/work/teamsettings/iterations`,
            'api-version=6.0'
        );
    }

    public static getIterationWorkItems(projectId: string, teamId: string, iterationId: string) {
        return ApiService.get<AzureDevopsResponse<DevopsTaskBoardWorkItem[]>>(
            `${projectId}/${teamId}/_apis/work/taskboardworkitems/${iterationId}`,
            'api-version=6.0-preview.1'
        );
    }
}

export interface AzureDevopsResponse<T> {
    count: number;
    value: T;
}
