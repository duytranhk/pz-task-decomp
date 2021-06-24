import { DevopsIteration } from './../../services/shared/azure-devops/azure-devops.models';
import { DevopsProject } from '../../services/shared/azure-devops/azure-devops.models';
import UtilService from '../../services/util.service';
import { AzureDevopsConfig } from './azure-devops.model';

export enum ActionTypes {
    SET_CONFIG = 'SET_CONFIG',
    VALIDATE_CONFIG = 'VALIDATE_CONFIG',
    TOGGLE_CONFIG_POPUP = 'TOGGLE_CONFIG_POPUP',
    SET_PROJECT = 'SET_PROJECT',
    SET_ITERATION = 'SET_ITERATION',
}

export interface AzureDevopsConfigState {
    config: AzureDevopsConfig | null;
    isValidated: boolean;
    showConfig: boolean;
    projects: DevopsProject[];
    iterations: DevopsIteration[];
}

interface AzureDevopsPayload {
    [ActionTypes.SET_CONFIG]: AzureDevopsConfig;
    [ActionTypes.VALIDATE_CONFIG]: boolean;
    [ActionTypes.TOGGLE_CONFIG_POPUP]: boolean;
    [ActionTypes.SET_PROJECT]: DevopsProject[];
    [ActionTypes.SET_ITERATION]: DevopsIteration[];
}

export type AzureDevopsActions = ActionMap<AzureDevopsPayload>[keyof ActionMap<AzureDevopsPayload>];

export const azureDevopsReducer = (state: AzureDevopsConfigState, action: AzureDevopsActions) => {
    switch (action.type) {
        case ActionTypes.SET_CONFIG:
            const config = { ...state.config, ...action.payload };
            UtilService.saveStorageItem('@app:azure-config', config);
            return { ...state, config };
        case ActionTypes.VALIDATE_CONFIG:
            return { ...state, isValidated: action.payload };
        case ActionTypes.TOGGLE_CONFIG_POPUP:
            return { ...state, showConfig: action.payload };
        case ActionTypes.SET_ITERATION:
            return { ...state, iterations: action.payload };
        case ActionTypes.SET_PROJECT:
            return { ...state, projects: action.payload };
        default:
            return state;
    }
};
