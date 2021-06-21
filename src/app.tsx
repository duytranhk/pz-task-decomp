import React, { ReactElement, FC } from 'react';
import MenuBar from './components/menu-bar.component';
import AppTheme from './components/app-theme.component';
import { BrowserRouter as Router } from 'react-router-dom';
import AppLayout from './app-layout';
import { AzureDevopsProvider } from './contexts/azure-devops/azure-devops.context';

const App: FC<any> = (): ReactElement => {
    return (
        <AppTheme>
            <Router>
                <AzureDevopsProvider>
                    <MenuBar />
                    <AppLayout />
                </AzureDevopsProvider>
            </Router>
        </AppTheme>
    );
};

export default App;
