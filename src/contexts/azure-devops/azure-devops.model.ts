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

export class WorkItemTypes {
    public static PBI = 'Product Backlog Item';
    public static BUG = 'Bug';
    public static TASK = 'Task';
}
