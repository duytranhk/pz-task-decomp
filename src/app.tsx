import React, { ReactElement, FC } from 'react';
import MenuBar from './components/menu-bar.component';
import AzureDevopsProvider from './contexts/azure-devops.context';
import AppTheme from './components/app-theme.component';
import { BrowserRouter as Router } from 'react-router-dom';
import AppLayout from './app-layout';

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
