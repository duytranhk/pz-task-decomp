import React, { ReactElement, FC } from 'react';
import { Container } from '@material-ui/core';
import Header from './components/header.component';
import MenuBar from './components/menu-bar.component';
import AzureDevopsProvider from './contexts/azure-devops.context';
import AppTheme from './components/app-theme.component';



const App: FC<any> = (): ReactElement => {
    return (
        <AppTheme>
            <AzureDevopsProvider>
                <MenuBar />
                <Container maxWidth="lg">
                    <Header />
                </Container>
            </AzureDevopsProvider>
        </AppTheme>
    );
};

export default App;
