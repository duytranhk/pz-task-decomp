import React, { ReactElement, FC } from 'react';
import { Typography, makeStyles, AppBar, Toolbar, IconButton } from '@material-ui/core';
import BuildIcon from '@material-ui/icons/Build';
import pzLogo from '../assets/pz-logo.png';
import DevopsConfigDialog from './devops-config-dialog.component';
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
    const [openConfigDialog, setOpenConfigDialog] = React.useState(false);
    const onConfigClick = () => {
        setOpenConfigDialog(true);
    };

    const handleCloseConfigDialog = () => {
        setOpenConfigDialog(false);
    };
    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <img src={pzLogo} alt="logo" className={classes.logo}></img>
                    <Typography variant="h6" className={classes.title}>
                        Quick Decomp
                    </Typography>
                    <IconButton aria-label="config" color="inherit" onClick={onConfigClick}>
                        <BuildIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <DevopsConfigDialog open={openConfigDialog} handleClose={handleCloseConfigDialog}></DevopsConfigDialog>
        </>
    );
};

export default MenuBar;
