import { AzureDevopsConfig } from './azure-devops.model';

export enum ActionTypes {
    GET_CONFIG = 'GET_CONFIG',
    SET_CONFIG = 'SET_CONFIG',
}

interface AzureDevopsPayload {
    [ActionTypes.GET_CONFIG]: AzureDevopsConfig;
    [ActionTypes.SET_CONFIG]: void;
}

export type AzureDevopsActions = ActionMap<AzureDevopsPayload>[keyof ActionMap<AzureDevopsPayload>];

export const sampleReducer = (state: AzureDevopsConfig, action: AzureDevopsActions) => {
    switch (action.type) {
        case ActionTypes.GET_CONFIG:
            return { ...state, ...action.payload };
        case ActionTypes.SET_CONFIG:
            // set configuration
            return state;
        default:
            return state;
    }
};
