import React, { FC, ReactElement } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import AzureDevopsClient from '../services/shared/azure-devops/azure-devops.client';
import UtilService from '../services/util.service';
export const AzureDevopsContext = React.createContext<AzureDevopsConfigState>({} as any);

export interface AzureDevopsConfig {
    endpoint?: string;
    accessToken?: string;
    selectedProjectId?: string;
    selectedTeamId?: string;
}

export interface AzureDevopsConfigState {
    config?: AzureDevopsConfig;
    hasConfigured?: boolean;
    setConfig: (config?: AzureDevopsConfig) => void;
    setHasConfigured: (value: boolean) => void;
}

const AzureDevopsProvider: FC<any> = (props): ReactElement => {
    const [config, setConfig] = useState<AzureDevopsConfig>();
    const [hasConfigured, setHasConfigured] = useState(false);
    useEffect(() => {
        const savedConfig = UtilService.getStorageObjectItem<AzureDevopsConfig>('@app:azure-config');
        setConfig(savedConfig!);
        const getProject = AzureDevopsClient.getProjects();
        const getTeams = AzureDevopsClient.getTeams();
        Promise.all([getProject, getTeams])
            .then((_) => setHasConfigured(!!savedConfig?.selectedProjectId))
            .catch((_) => setHasConfigured(false));
    }, []);

    return (
        <AzureDevopsContext.Provider
            value={{
                config,
                hasConfigured,
                setConfig: (config) => setConfig(config),
                setHasConfigured: (value) => setHasConfigured(value),
            }}
        >
            {props.children}
        </AzureDevopsContext.Provider>
    );
};
export default AzureDevopsProvider;
