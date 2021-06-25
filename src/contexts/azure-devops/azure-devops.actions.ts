import { DevopsWorkItem } from './../../services/shared/azure-devops/azure-devops.models';
import { Dispatch } from 'react';
import AzureDevopsClient from '../../services/shared/azure-devops/azure-devops.client';
import UtilService from '../../services/util.service';
import { AzureDevopsConfig } from './azure-devops.model';
import { ActionTypes, AzureDevopsActions } from './azure-devops.reducer';

export class AzureDevopsAction {
    loadConfig = () => async (dispatch: Dispatch<AzureDevopsActions>) => {
        const savedConfig = UtilService.getStorageObjectItem<AzureDevopsConfig>('@app:azure-config');
        if (await this.validate(savedConfig!)(dispatch)) {
            this.setConfig(savedConfig!)(dispatch);
        }
    };

    setConfig = (config: AzureDevopsConfig) => async (dispatch: Dispatch<AzureDevopsActions>) => {
        dispatch({ type: ActionTypes.SET_CONFIG, payload: config });
    };

    loadProjects = () => async (dispatch: Dispatch<AzureDevopsActions>) => {
        const res = await AzureDevopsClient.getProjects();
        dispatch({ type: ActionTypes.SET_PROJECT, payload: res.value });
        return res.value;
    };

    loadIteration = (projectId: string) => async (dispatch: Dispatch<AzureDevopsActions>) => {
        const res = await AzureDevopsClient.getIterations(projectId);
        dispatch({ type: ActionTypes.SET_ITERATION, payload: res.value });
        return res.value;
    };

    togglePopup = (value: boolean) => (dispatch: Dispatch<AzureDevopsActions>) => {
        dispatch({ type: ActionTypes.TOGGLE_CONFIG_POPUP, payload: value });
    };

    validate = (config: AzureDevopsConfig) => async (dispatch: Dispatch<AzureDevopsActions>) => {
        this.setConfig(config)(dispatch);
        try {
            await this.loadProjects()(dispatch);
            if (config?.selectedProjectId) {
                await this.loadIteration(config.selectedProjectId)(dispatch);
            }
            dispatch({ type: ActionTypes.VALIDATE_CONFIG, payload: true });
            return true;
        } catch (error) {
            dispatch({ type: ActionTypes.VALIDATE_CONFIG, payload: false });
            dispatch({ type: ActionTypes.SET_PROJECT, payload: [] });
            dispatch({ type: ActionTypes.SET_CONFIG, payload: { selectedProjectId: '' } });
        }
        return false;
    };

    createNewTasks = (title: string, id: number = 0) => {
        return {
            id,
            rev: 0,
            url: '',
            fields: {
                'System.Title': title,
                'System.State': 'To Do',
            },
        } as DevopsWorkItem;
    };
}
