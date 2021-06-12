import React, { ReactElement, FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { routes } from '../config/router-config';
import NavigationItem from './navigation-item.component';

const useStyles = makeStyles({
    root: {
        padding: '2rem 0',
        display: 'flex',
    },
    navItem: {
        marginRight: '1rem',
    },
});

const NavigationBar: FC<any> = (): ReactElement => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            {routes.map((r) => (
                <div className={classes.navItem} key={r.key as string}>
                    <NavigationItem routeItem={r} />
                </div>
            ))}
        </div>
    );
};

export default NavigationBar;
