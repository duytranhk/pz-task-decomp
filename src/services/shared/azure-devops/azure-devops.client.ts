import ApiService from '../api.service';
import { DevopsProject, DevopsIteration, DevopsTaskBoardWorkItem, DevopsTeams, DevopsWorkItem } from './azure-devops.models';

export default class AzureDevopsClient {
    public static getProjects() {
        return ApiService.get<AzureDevopsResponse<DevopsProject[]>>('_apis/projects', '6.1-preview.1');
    }

    public static getTeams() {
        return ApiService.get<AzureDevopsResponse<DevopsTeams[]>>('_apis/teams', '6.1-preview.3', { $mine: true });
    }

    public static getIterations(projectId: string, teamId: string) {
        return ApiService.get<AzureDevopsResponse<DevopsIteration[]>>(
            `${projectId}/${teamId}/_apis/work/teamsettings/iterations`,
            '6.1-preview.1'
        );
    }

    public static getIterationWorkItems(projectId: string, teamId: string, iterationId: string) {
        return ApiService.get<DevopsTaskBoardWorkItem>(
            `${projectId}/${teamId}/_apis/work/teamsettings/iterations/${iterationId}/workitems`,
            '6.1-preview.1'
        );
    }

    public static getWorkItems(projectId: string, workItemIds: number[]) {
        const wIds = workItemIds.join(',');
        return ApiService.get<AzureDevopsResponse<DevopsWorkItem[]>>(`${projectId}/_apis/wit/workitems`, '6.1-preview.3', { ids: wIds });
    }
}

export interface AzureDevopsResponse<T> {
    count: number;
    value: T;
}
