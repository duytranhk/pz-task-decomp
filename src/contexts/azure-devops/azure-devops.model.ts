export interface AzureDevopsConfig {
    endpoint?: string;
    accessToken?: string;
    selectedProjectId?: string;
}

export interface WorkItemFields {
    op?: string;
    path?: string;
    from?: string | null;
    value?: any;
}

export enum GenerateTaskType {
    API,
    UI,
    Common,
    Bug,
    Single,
}
