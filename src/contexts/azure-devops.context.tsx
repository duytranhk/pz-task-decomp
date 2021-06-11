import React, { Component } from 'react';
export const AzureDevopsContext = React.createContext<AzureDevopsConfigState>({} as any);

export interface AzureDevopsConfig {
    endpoint?: string;
    accessToken?: string;
}

export interface AzureDevopsConfigState {
    config?: AzureDevopsConfig;
    setConfig: (config?: AzureDevopsConfig) => void;
}

class AzureDevopsProvider extends Component {
    state = {
        config: {},
        setConfig: (config?: AzureDevopsConfig) => {
            this.setState({ ...this.state, config });
        },
    };
    render() {
        return <AzureDevopsContext.Provider value={this.state}>{this.props.children}</AzureDevopsContext.Provider>;
    }
}
export default AzureDevopsProvider;
