import React, { Component } from 'react';
import UtilService from '../services/util.service';
export const AzureDevopsContext = React.createContext<AzureDevopsConfigState>({} as any);

export interface AzureDevopsConfig {
    endpoint?: string;
    accessToken?: string;
}

export interface AzureDevopsConfigState {
    config?: AzureDevopsConfig;
    hasConfigured?: boolean;
    setConfig: (config?: AzureDevopsConfig) => void;
}

class AzureDevopsProvider extends Component {
    private config = UtilService.getStorageItem<AzureDevopsConfig>('@app:azure-config');
    private hasConfigured = !!this.config?.endpoint && !!this.config?.accessToken;
    state = {
        config: this.config,
        hasConfigured: this.hasConfigured,
        setConfig: (config?: AzureDevopsConfig) => {
            const newState = { ...this.state, config };
            const hasConfigured = newState.config?.endpoint && newState.config?.accessToken;
            this.setState({ ...newState, hasConfigured });
            UtilService.saveStorageItem('@app:azure-config', newState.config);
        },
    };
    render() {
        return <AzureDevopsContext.Provider value={this.state}>{this.props.children}</AzureDevopsContext.Provider>;
    }
}
export default AzureDevopsProvider;
