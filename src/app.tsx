import React, { ReactElement, FC } from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { Container } from '@material-ui/core';
import Header from './components/header.component';
import MenuBar from './components/menu-bar.component';
import AzureDevopsProvider from './contexts/azure-devops.context';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#0097a7',
        },
        secondary: {
            main: '#00838f',
        },
    },
    overrides: {
        MuiPaper: {
            rounded: {
                borderRadius: 16
            },
        },
    },
});

const App: FC<any> = (): ReactElement => {
    return (
        <ThemeProvider theme={theme}>
            <AzureDevopsProvider>
                <MenuBar />
                <Container maxWidth="lg">
                    <Header />
                </Container>
            </AzureDevopsProvider>
        </ThemeProvider>
    );
};

export default App;
