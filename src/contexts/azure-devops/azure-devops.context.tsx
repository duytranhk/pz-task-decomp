import React, { Dispatch, FC, ReactElement, useContext, useEffect, useReducer } from 'react';
import { AzureDevopsAction } from './azure-devops.actions';
import { AzureDevopsActions, AzureDevopsConfigState, azureDevopsReducer } from './azure-devops.reducer';

const initialState: AzureDevopsConfigState = {
    config: {
        accessToken: '',
        endpoint: '',
        selectedProjectId: '',
        selectedTeamId: '',
    },
    hasConfigured: false,
    showConfig: false,
    teams: [],
    projects: [],
};

export const AzureDevopsContext = React.createContext<ContextWithReducer<AzureDevopsConfigState, Dispatch<AzureDevopsActions>>>({
    state: initialState,
    dispatch: () => null,
});

const reducer = (state: AzureDevopsConfigState, action: AzureDevopsActions) => azureDevopsReducer(state, action);

const AzureDevopsProvider: FC<any> = (props): ReactElement => {
    const [state, dispatch] = useReducer(reducer, initialState);
    useEffect(() => {
        azureDevopsActions.loadConfig()(dispatch);
    }, []);
    return <AzureDevopsContext.Provider value={{ state, dispatch }}>{props.children}</AzureDevopsContext.Provider>;
};

const azureDevopsActions = new AzureDevopsAction();
const useAzureDevopsContext = () => useContext(AzureDevopsContext);
export { AzureDevopsProvider, useAzureDevopsContext, azureDevopsActions };
