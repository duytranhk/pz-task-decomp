import React, { ReactElement, FC } from 'react';
import { Link, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { azureDevopsActions, useAzureDevopsContext } from '../contexts/azure-devops/azure-devops.context';
import SuccessIcon from '@material-ui/icons/CheckCircle';
import WarningIcon from '@material-ui/icons/Warning';
import clsx from 'clsx';
import { appColor } from '../utils/constants';

const useStyles = makeStyles({
    root: {
        display: 'flex',
        textAlign: 'center',
        justifyContent: 'center',
    },
    title: {
        fontWeight: 550,
    },
    caption: {
        color: appColor.subtitle,
    },
    icon: {
        fontSize: '5rem',
    },
    success: {
        color: appColor.success,
    },
    warn: {
        color: appColor.warning,
    },
});
const HomePage: FC<any> = (): ReactElement => {
    const classes = useStyles();
    const {
        state: { hasConfigured },
        dispatch,
    } = useAzureDevopsContext();
    const handleSettingClick = (event: React.SyntheticEvent) => {
        event.preventDefault();
        azureDevopsActions.togglePopup(true)(dispatch);
    };
    return (
        <div className={classes.root}>
            {hasConfigured ? (
                <div>
                    <SuccessIcon className={clsx(classes.icon, classes.success)} />
                    <Typography className={classes.title} variant="h3" color="primary" gutterBottom>
                        You're all set!
                    </Typography>
                    <Typography className={classes.caption} variant="body1" gutterBottom>
                        Keep up your good work
                    </Typography>
                </div>
            ) : (
                <div>
                    <WarningIcon className={clsx(classes.icon, classes.warn)} />
                    <Typography className={classes.title} variant="h3" color="error" gutterBottom>
                        Ops!
                    </Typography>
                    <Typography className={classes.caption} variant="body1" gutterBottom>
                        Looks like you haven't configured &nbsp;
                        <Link href="#" onClick={handleSettingClick}>
                            Azure Devops setting.
                        </Link>
                    </Typography>
                </div>
            )}
        </div>
    );
};

export default HomePage;
