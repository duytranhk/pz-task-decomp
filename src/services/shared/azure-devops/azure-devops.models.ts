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
    source?: DevopsWorkItemReference[];
    target?: DevopsWorkItemReference[];
}

export interface DevopsWorkItemReference {
    id: number;
    url: string;
}
