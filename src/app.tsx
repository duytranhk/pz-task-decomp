import React, { ReactElement, FC } from 'react';
import MenuBar from './components/menu-bar.component';
import AppTheme from './components/app-theme.component';
import { BrowserRouter as Router } from 'react-router-dom';
import AppLayout from './app-layout';
import { AzureDevopsProvider } from './contexts/azure-devops/azure-devops.context';
import { LoaderProvider } from './contexts/loader/loader.context';

const App: FC<any> = (): ReactElement => {
    return (
        <AppTheme>
            <Router>
                <LoaderProvider>
                    <AzureDevopsProvider>
                        <MenuBar />
                        <AppLayout />
                    </AzureDevopsProvider>
                </LoaderProvider>
            </Router>
        </AppTheme>
    );
};

export default App;
