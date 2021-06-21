import { Icon, makeStyles, Tooltip } from '@material-ui/core';
import React, { ReactElement, FC } from 'react';
import { RouteItem } from '../models/route-item.model';
import { NavLink } from 'react-router-dom';
const useStyles = makeStyles({
    root: {
        width: 75,
        height: 75,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '20%',
        backgroundColor: '#ececec',
        position: 'relative',
        boxShadow: 'none',
        transition: 'box-shadow 0.3s ease-in-out',
    },
    icon: {
        fontSize: '2rem',
        color: '#ffffff',
    },
    selected: {
        boxShadow: '0 3px 11px 0 rgb(0 152 167)',
    },
});

const NavigationItem: FC<NavigationItemProps> = ({ routeItem }): ReactElement => {
    const classes = useStyles();
    return (
        <Tooltip title={routeItem.title}>
            <NavLink
                className={classes.root}
                to={routeItem.path as string}
                key={routeItem.key as string}
                activeClassName={classes.selected}
                style={{ background: routeItem.background }}
            >
                <Icon className={classes.icon} component={routeItem.icon} />
            </NavLink>
        </Tooltip>
    );
};

interface NavigationItemProps {
    routeItem: RouteItem;
}

export default NavigationItem;
