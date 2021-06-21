import React, { ReactElement, FC, useContext } from 'react';
import { Typography, makeStyles, AppBar, Toolbar, IconButton, Badge } from '@material-ui/core';
import BuildIcon from '@material-ui/icons/Build';
import pzLogo from '../assets/pz-logo.png';
import { AzureDevopsContext } from '../contexts/azure-devops/azure-devops.context';
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
    const { hasConfigured, setShowConfig } = useContext(AzureDevopsContext);
    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <img src={pzLogo} alt="logo" className={classes.logo}></img>
                    <Typography variant="h6" className={classes.title}>
                        Quick Decomp
                    </Typography>
                    <IconButton aria-label="config" color="inherit" onClick={() => setShowConfig(true)}>
                        <Badge color="error" variant={hasConfigured ? undefined : 'dot'}>
                            <BuildIcon />
                        </Badge>
                    </IconButton>
                </Toolbar>
            </AppBar>
        </>
    );
};

export default MenuBar;
