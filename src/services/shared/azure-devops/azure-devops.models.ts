export interface DevopsProject {
    id: string;
    name: string;
    description: string;
    url: string;
}

export interface DevopsIteration {
    id: string;
    name: string;
    url: string;
}

export interface DevopsTaskBoardWorkItem {
    url: string;
    workItemRelations: DevopsWorkItemLink[];
}

export interface DevopsTeams {
    id: string;
    name: string;
    url: string;
    description: string;
    identityUrl: string;
}

export interface DevopsWorkItemLink {
    rel?: string;
    source?: DevopsWorkItemReference;
    target?: DevopsWorkItemReference;
}

export interface DevopsWorkItemReference {
    id: number;
    url: string;
}

export interface DevopsWorkItem {
    id: number;
    rev: number;
    fields: DevopsWorkItemFields;
    url: string;
}

export interface DevopsWorkItemFields {
    'System.AreaPath'?: string;
    'System.TeamProject'?: string;
    'System.IterationPath'?: string;
    'System.WorkItemType'?: string;
    'System.State'?: string;
    'System.Reason'?: string;
    'System.ChangedDate'?: Date;
    'System.CreatedDate'?: Date;
    'Microsoft.VSTS.Scheduling.Effort'?: number;
    'System.Title'?: string;
    'System.Description'?: string;
    'Microsoft.VSTS.Common.BacklogPriority'?: number;
    'Microsoft.VSTS.Common.Priority'?: number;
    'Microsoft.VSTS.Scheduling.RemainingWork'?: number;
}

export interface BackLogItem extends DevopsWorkItem {
    taskIds: number[];
}
