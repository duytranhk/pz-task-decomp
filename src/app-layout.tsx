import React, { ReactElement, FC } from 'react';
import { Container } from '@material-ui/core';
import NavigationBar from './components/navigation-bar.component';
import { Redirect, Route, Switch } from 'react-router-dom';
import { RouteItem } from './models/route-item.model';
import { routes } from './config/router-config';
import DevopsConfigDialog from './components/devops-config-dialog.component';
import { useAzureDevopsContext, azureDevopsActions } from './contexts/azure-devops/azure-devops.context';

const AppLayout: FC<any> = (): ReactElement => {
    const {
        state: { showConfig },
        dispatch,
    } = useAzureDevopsContext();
    return (
        <Container maxWidth="lg">
            <NavigationBar />
            <Switch>
                {showConfig && (
                    <DevopsConfigDialog
                        open={showConfig}
                        handleClose={() => azureDevopsActions.togglePopup(false)(dispatch)}
                    ></DevopsConfigDialog>
                )}
                {routes.map((route: RouteItem) => (
                    <Route key={`${route.key}`} path={`${route.path}`} component={route.component} exact />
                ))}
                <Redirect from="/" to="/home" exact />
            </Switch>
        </Container>
    );
};

export default AppLayout;
