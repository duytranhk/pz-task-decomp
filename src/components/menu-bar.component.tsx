import React, { ReactElement, FC } from 'react';
import { Typography, makeStyles, AppBar, Toolbar, IconButton, Badge } from '@material-ui/core';
import BuildIcon from '@material-ui/icons/Build';
import pzLogo from '../assets/pz-logo.png';
import { azureDevopsActions, useAzureDevopsContext } from '../contexts/azure-devops/azure-devops.context';
const useStyles = makeStyles((theme) => ({
    logo: {
        maxHeight: 60,
    },
    title: {
        marginLeft: 5,
        flexGrow: 1,
    },
    config: {
        marginLeft: 5,
        flexGrow: 1,
    },
}));
const MenuBar: FC<any> = (): ReactElement => {
    const classes = useStyles();
    const {
        state: { hasConfigured },
        dispatch,
    } = useAzureDevopsContext();
    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <img src={pzLogo} alt="logo" className={classes.logo}></img>
                    <Typography variant="h6" className={classes.title}>
                        Quick Decomp
                    </Typography>
                    <IconButton aria-label="config" color="inherit" onClick={() => azureDevopsActions.togglePopup(true)(dispatch)}>
                        <Badge color="error" variant={hasConfigured ? 'standard' : 'dot'}>
                            <BuildIcon />
                        </Badge>
                    </IconButton>
                </Toolbar>
            </AppBar>
        </>
    );
};

export default MenuBar;
