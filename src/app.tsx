import React, { ReactElement, FC } from 'react';
import MenuBar from './components/menu-bar.component';
import AzureDevopsProvider from './contexts/azure-devops.context';
import AppTheme from './components/app-theme.component';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import AppLayout from './app-layout';

const App: FC<any> = (): ReactElement => {
    return (
        <AppTheme>
            <Router>
                <Switch>
                    <AzureDevopsProvider>
                        <MenuBar />
                        <Route path="*">
                            <AppLayout />
                        </Route>
                        <Redirect from="/" to="/home" exact />
                    </AzureDevopsProvider>
                </Switch>
            </Router>
        </AppTheme>
    );
};

export default App;
