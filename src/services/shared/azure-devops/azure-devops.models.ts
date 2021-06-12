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
    column: string;
    columnId: string;
    state: string;
    workItemId: string;
}

export interface DevopsTeams {
    id: string;
    name: string;
    url: string;
    description: string;
    identityUrl: string;
}
