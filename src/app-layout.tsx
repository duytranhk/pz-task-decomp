import React, { ReactElement, FC } from 'react';
import { Container } from '@material-ui/core';
import NavigationBar from './components/navigation-bar.component';
import { Redirect, Route, Switch, useLocation } from 'react-router-dom';
import { RouteItem } from './models/route-item.model';
import { routes } from './config/router-config';

const AppLayout: FC<any> = (): ReactElement => {
    const location = useLocation();
    return (
        <Container maxWidth="lg">
            <NavigationBar />
            <Switch location={location}>
                {routes.map((route: RouteItem) => (
                    <Route key={`${route.key}`} path={`${route.path}`} component={route.component} exact />
                ))}
                <Redirect from="/" to="/home" exact />
            </Switch>
        </Container>
    );
};

export default AppLayout;
