import React, { Dispatch, FC, ReactElement, useContext, useEffect, useReducer } from 'react';
import { loaderActions, useLoaderContext } from '../loader/loader.context';
import { AzureDevopsAction } from './azure-devops.actions';
import { AzureDevopsActions, AzureDevopsConfigState, azureDevopsReducer } from './azure-devops.reducer';

const initialState: AzureDevopsConfigState = {
    config: {
        accessToken: '',
        endpoint: '',
        selectedProjectId: '',
    },
    isValidated: false,
    showConfig: false,
    projects: [],
    iterations: [],
};

export const AzureDevopsContext = React.createContext<ContextWithReducer<AzureDevopsConfigState, Dispatch<AzureDevopsActions>>>({
    state: initialState,
    dispatch: () => null,
});

const reducer = (state: AzureDevopsConfigState, action: AzureDevopsActions) => azureDevopsReducer(state, action);

const AzureDevopsProvider: FC<any> = (props): ReactElement => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const loaderContext = useLoaderContext();
    useEffect(() => {
        loaderActions.showLoader(loaderContext.dispatch);
        azureDevopsActions
            .loadConfig()(dispatch)
            .finally(() => loaderActions.hideLoader(loaderContext.dispatch));
    }, []);
    return <AzureDevopsContext.Provider value={{ state, dispatch }}>{props.children}</AzureDevopsContext.Provider>;
};

const azureDevopsActions = new AzureDevopsAction();
const useAzureDevopsContext = () =>
    useContext<ContextWithReducer<AzureDevopsConfigState, Dispatch<AzureDevopsActions>>>(AzureDevopsContext);
export { AzureDevopsProvider, useAzureDevopsContext, azureDevopsActions };
