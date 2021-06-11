import React, { FC, ReactElement } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import AzureDevopsService from '../services/azure-devops.service';
import UtilService from '../services/util.service';
export const AzureDevopsContext = React.createContext<AzureDevopsConfigState>({} as any);

export interface AzureDevopsConfig {
    endpoint?: string;
    accessToken?: string;
}

export interface AzureDevopsConfigState {
    config?: AzureDevopsConfig;
    hasConfigured?: boolean;
    projects?: any;
    setConfig: (config?: AzureDevopsConfig) => void;
}

const AzureDevopsProvider: FC<any> = (props): ReactElement => {
    const [config, setConfig] = useState<AzureDevopsConfig>({});
    const [projects, setProjects] = useState([]);
    const [hasConfigured, setHasConfigured] = useState(false);
    useEffect(() => {
        setConfig(UtilService.getStorageItem<AzureDevopsConfig>('@app:azure-config'));
    }, []);

    useEffect(() => {
        UtilService.saveStorageItem('@app:azure-config', config);
        const hasConfigured = !!config?.endpoint && !!config?.accessToken;
        setHasConfigured(hasConfigured);
        if (hasConfigured) {
            AzureDevopsService.init(config);
            AzureDevopsService.getProjects().then((data) => {
                setProjects(data.value);
            });
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
