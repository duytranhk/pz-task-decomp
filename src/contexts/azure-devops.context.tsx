import React, { FC, ReactElement } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import AzureDevopsClient from '../services/shared/azure-devops/azure-devops.client';
import { DevopsProject } from '../services/shared/azure-devops/azure-devops.models';
import UtilService from '../services/util.service';
export const AzureDevopsContext = React.createContext<AzureDevopsConfigState>({} as any);

export interface AzureDevopsConfig {
    endpoint?: string;
    accessToken?: string;
    selectedProjectId?: string;
}

export interface AzureDevopsConfigState {
    config?: AzureDevopsConfig;
    hasConfigured?: boolean;
    projects?: DevopsProject[];
    setConfig: (config?: AzureDevopsConfig) => void;
}

const AzureDevopsProvider: FC<any> = (props): ReactElement => {
    const [config, setConfig] = useState<AzureDevopsConfig>();
    const [projects, setProjects] = useState<DevopsProject[]>();
    const [hasConfigured, setHasConfigured] = useState(false);
    useEffect(() => {
        setConfig(UtilService.getStorageItem<AzureDevopsConfig>('@app:azure-config'));
    }, []);

    useEffect(() => {
        UtilService.saveStorageItem('@app:azure-config', config);
        if (config?.endpoint && config?.accessToken) {
            AzureDevopsClient.getProjects().then((res) => {
                setProjects(res.value);
            });
            setHasConfigured(!!config?.selectedProjectId);
        } else {
            setHasConfigured(false);
        }
    }, [config]);

    return (
        <AzureDevopsContext.Provider
            value={{
                config,
                hasConfigured,
                projects,
                setConfig: (config) => setConfig(config!),
            }}
        >
            {props.children}
        </AzureDevopsContext.Provider>
    );
};
export default AzureDevopsProvider;
