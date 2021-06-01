import React, { Component } from 'react';
export const AzureDevopsContext = React.createContext<AzureDevopsConfig>({} as any);

export interface AzureDevopsConfig {
    endpoint?: string;
    accessToken?: string;
    setEndpoint: (endpoint: string) => void;
    setAccessToken: (accessToken: string) => void;
}

class AzureDevopsProvider extends Component {
    state = {
        endpoint: '',
        accessToken: '',
        setEndpoint: (endpoint: string) => {
            this.setState({
                endpoint,
            });
        },
        setAccessToken: (accessToken: string) => {
            this.setState({
                accessToken,
            });
        },
    };
    render() {
        return <AzureDevopsContext.Provider value={this.state}>{this.props.children}</AzureDevopsContext.Provider>;
    }
}
export default AzureDevopsProvider;
