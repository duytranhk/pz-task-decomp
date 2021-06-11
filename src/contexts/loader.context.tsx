import React, { Component } from 'react';
export const LoaderContext = React.createContext<LoaderContextState>({} as any);

export interface LoaderContextState {
    isLoading: boolean;
    setLoader: (isLoading: boolean) => void;
}

class LoaderProvider extends Component {
    state = {
        isLoading: false,
        setLoader: (isLoading: boolean) => {
            this.setState({ ...this.state, isLoading });
        },
    };
    render() {
        return <LoaderContext.Provider value={this.state}>{this.props.children}</LoaderContext.Provider>;
    }
}
export default LoaderProvider;
