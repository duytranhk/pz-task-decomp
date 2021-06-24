import { WorkItemFields } from '../../../contexts/azure-devops/azure-devops.model';
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

    public static createTask(projectId: string, iterationPath: string, parentUrl: string, title: string) {
        return this.createWorkItem(projectId, '$Task', title, iterationPath).then((r) => {
            const data: WorkItemFields[] = [
                {
                    op: 'add',
                    path: '/relations/-',
                    value: {
                        rel: 'System.LinkTypes.Hierarchy-Reverse',
                        url: parentUrl,
                        attributes: {
                            isLocked: false,
                            name: 'Parent',
                        },
                    },
                },
            ];
            return this.updateWorkItem(projectId, r.id, data);
        });
    }

    public static createWorkItem(projectId: string, type: string, title: string, iterationPath: string) {
        const data: WorkItemFields[] = [
            {
                op: 'add',
                path: '/fields/System.Title',
                value: title,
            },
            {
                op: 'add',
                path: '/fields/System.IterationPath',
                value: iterationPath,
            },
        ];
        return ApiService.post<WorkItemFields[], DevopsWorkItem>(`${projectId}/_apis/wit/workitems/${type}`, data, '6.0');
    }

    public static updateWorkItem(projectId: string, id: number, fields: WorkItemFields[]) {
        return ApiService.patch<WorkItemFields[], DevopsWorkItem>(`${projectId}/_apis/wit/workitems/${id}`, fields, '6.0');
    }
}

export interface AzureDevopsResponse<T> {
    count: number;
    value: T;
}
