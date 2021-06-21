import { DevopsTeams } from './../../services/shared/azure-devops/azure-devops.models';
import { DevopsProject } from '../../services/shared/azure-devops/azure-devops.models';
import UtilService from '../../services/util.service';
import { AzureDevopsConfig } from './azure-devops.model';

export enum ActionTypes {
    SET_CONFIG = 'SET_CONFIG',
    VALIDATE_CONFIG = 'VALIDATE_CONFIG',
    TOGGLE_CONFIG_POPUP = 'TOGGLE_CONFIG_POPUP',
    SET_PROJECT = 'SET_PROJECT',
    SET_TEAM = 'SET_TEAM',
}

export interface AzureDevopsConfigState {
    config: AzureDevopsConfig | null;
    hasConfigured: boolean;
    showConfig: boolean;
    projects: DevopsProject[];
    teams: DevopsTeams[];
}

interface AzureDevopsPayload {
    [ActionTypes.SET_CONFIG]: AzureDevopsConfig;
    [ActionTypes.VALIDATE_CONFIG]: boolean;
    [ActionTypes.TOGGLE_CONFIG_POPUP]: boolean;
    [ActionTypes.SET_PROJECT]: DevopsProject[];
    [ActionTypes.SET_TEAM]: DevopsTeams[];
}

export type AzureDevopsActions = ActionMap<AzureDevopsPayload>[keyof ActionMap<AzureDevopsPayload>];

export const azureDevopsReducer = (state: AzureDevopsConfigState, action: AzureDevopsActions) => {
    switch (action.type) {
        case ActionTypes.SET_CONFIG:
            UtilService.saveStorageItem('@app:azure-config', action.payload);
            return { ...state, config: { ...state.config, ...action.payload } };
        case ActionTypes.VALIDATE_CONFIG:
            const hasConfigured = !!state.config?.selectedProjectId && !!state.config?.selectedTeamId && action.payload;
            return { ...state, hasConfigured };
        case ActionTypes.TOGGLE_CONFIG_POPUP:
            return { ...state, showConfig: action.payload };
        case ActionTypes.SET_TEAM:
            return { ...state, teams: action.payload };
        case ActionTypes.SET_PROJECT:
            return { ...state, projects: action.payload };
        default:
            return state;
    }
};
