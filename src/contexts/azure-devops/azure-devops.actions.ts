import { Dispatch } from 'react';
import AzureDevopsClient from '../../services/shared/azure-devops/azure-devops.client';
import UtilService from '../../services/util.service';
import { AzureDevopsConfig } from './azure-devops.model';
import { ActionTypes, AzureDevopsActions } from './azure-devops.reducer';

export class AzureDevopsAction {
    loadConfig = () => async (dispatch: Dispatch<AzureDevopsActions>) => {
        const savedConfig = UtilService.getStorageObjectItem<AzureDevopsConfig>('@app:azure-config');
        dispatch({ type: ActionTypes.SET_CONFIG, payload: savedConfig! });
        if (savedConfig) {
            try {
                await this.loadProjects()(dispatch);
                await this.loadTeams()(dispatch);
                dispatch({ type: ActionTypes.VALIDATE_CONFIG, payload: true });
            } catch (error) {
                dispatch({ type: ActionTypes.VALIDATE_CONFIG, payload: false });
            }
        }
    };

    setConfig = (config: AzureDevopsConfig) => async (dispatch: Dispatch<AzureDevopsActions>) => {
        dispatch({ type: ActionTypes.SET_CONFIG, payload: config });
        try {
            await this.loadProjects()(dispatch);
            dispatch({ type: ActionTypes.VALIDATE_CONFIG, payload: true });
        } catch (error) {
            dispatch({ type: ActionTypes.VALIDATE_CONFIG, payload: false });
        }
    };

    loadProjects = () => async (dispatch: Dispatch<AzureDevopsActions>) => {
        const res = await AzureDevopsClient.getProjects();
        dispatch({ type: ActionTypes.SET_PROJECT, payload: res.value });
        return res.value;
    };

    loadTeams = () => async (dispatch: Dispatch<AzureDevopsActions>) => {
        const res = await AzureDevopsClient.getTeams();
        dispatch({ type: ActionTypes.SET_TEAM, payload: res.value });
        return res.value;
    };

    togglePopup = (value: boolean) => (dispatch: Dispatch<AzureDevopsActions>) => {
        dispatch({ type: ActionTypes.TOGGLE_CONFIG_POPUP, payload: value });
    };
}
