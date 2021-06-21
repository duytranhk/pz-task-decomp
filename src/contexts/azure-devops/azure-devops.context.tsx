import React, { FC, ReactElement } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import AzureDevopsClient from '../../services/shared/azure-devops/azure-devops.client';
import UtilService from '../../services/util.service';
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
    showConfig: boolean;
    setConfig: (config?: AzureDevopsConfig) => void;
    setHasConfigured: (value: boolean) => void;
    setShowConfig: (value: boolean) => void;
}

const AzureDevopsProvider: FC<any> = (props): ReactElement => {
    const [config, setConfig] = useState<AzureDevopsConfig>();
    const [hasConfigured, setHasConfigured] = useState(false);
    const [showConfig, setShowConfig] = useState(false);
    useEffect(() => {
        const savedConfig = UtilService.getStorageObjectItem<AzureDevopsConfig>('@app:azure-config');
        setConfig(savedConfig!);
        AzureDevopsClient.getProjects()
            .then((_) => setHasConfigured(!!savedConfig?.selectedProjectId && !!savedConfig?.selectedTeamId))
            .catch((_) => setHasConfigured(false));
    }, []);

    return (
        <AzureDevopsContext.Provider
            value={{
                config,
                hasConfigured,
                showConfig,
                setConfig: (config) => setConfig(config),
                setHasConfigured: (value) => setHasConfigured(value),
                setShowConfig: (value) => setShowConfig(value),
            }}
        >
            {props.children}
        </AzureDevopsContext.Provider>
    );
};
export default AzureDevopsProvider;
