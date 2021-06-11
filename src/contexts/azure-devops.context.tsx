import React, { Component } from 'react';
export const AzureDevopsContext = React.createContext<AzureDevopsConfig>({} as any);

export interface AzureDevopsConfig {
    endpoint?: string;
    accessToken?: string;
}

class AzureDevopsProvider extends Component {
    state = {
        endpoint: '',
        accessToken: '',
    };
    render() {
        return <AzureDevopsContext.Provider value={this.state}>{this.props.children}</AzureDevopsContext.Provider>;
    }
}
export default AzureDevopsProvider;
