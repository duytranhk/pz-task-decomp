import React, { FC, ReactElement, useState } from 'react';
import {
    DialogContent,
    DialogActions,
    Button,
    DialogTitle,
    Dialog,
    Grid,
    Card,
    Typography,
    Chip,
    CardHeader,
    MenuItem,
    Menu,
} from '@material-ui/core';
import { useEffect } from 'react';
import { BackLogItem, DevopsWorkItem } from '../services/shared/azure-devops/azure-devops.models';
import AzureDevopsClient from '../services/shared/azure-devops/azure-devops.client';
import { makeStyles } from '@material-ui/core/styles';
import _ from 'lodash';
const useStyles = makeStyles({
    dialogContent: {
        padding: '8px 0',
    },
    taskContainer: {
        flexGrow: 0.5,
        padding: '1rem',
    },
    taskState: {
        color: '#fff',
        letterSpacing: 1,
    },
    generateBtn: {
        marginLeft: 'auto',
    },
    header: {
        display: 'flex',
    },
});
const StoryDetailDialog: FC<StoryDetailDialogProps> = ({ task, projectId, open, handleClose }): ReactElement => {
    const classes = useStyles();
    const [tasks, setTasks] = useState<DevopsWorkItem[]>([]);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    useEffect(() => {
        if (task?.taskIds) {
            AzureDevopsClient.getWorkItems(projectId, task.taskIds).then((res) => {
                setTasks(
                    _.orderBy(res.value, (v) => {
                        if (v.fields['System.State'].toLocaleLowerCase() === 'to do') return 0;
                        if (v.fields['System.State'].toLocaleLowerCase() === 'in progress') return 1;
                        if (v.fields['System.State'].toLocaleLowerCase() === 'done') return 2;
                        return 3;
                    })
                );
            });
        }
    }, [task, projectId]);
    const getStateColor = (state: string): string => {
        switch (state.toLowerCase()) {
            case 'to do':
                return '#0097a7';
            case 'in progress':
                return '#1976D2';
            case 'done':
                return '#388E3C';
        }
        return '';
    };

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const onGenerateTaskClick = () => {
        alert('Coming soon');
        setAnchorEl(null);
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md" disableBackdropClick>
            <DialogTitle>
                <div className={classes.header}>
                    {task.fields['System.Title']}
                    <Button
                        className={classes.generateBtn}
                        variant="outlined"
                        color="primary"
                        aria-controls="generate-task-menu"
                        aria-haspopup="true"
                        onClick={handleClick}
                    >
                        Add
                    </Button>
                    <Menu id="generate-task-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleCloseMenu}>
                        <MenuItem onClick={onGenerateTaskClick}>UI tasks</MenuItem>
                        <MenuItem onClick={onGenerateTaskClick}>API tasks</MenuItem>
                        <MenuItem onClick={onGenerateTaskClick}>Single task</MenuItem>
                    </Menu>
                </div>
            </DialogTitle>
            <DialogContent className={classes.dialogContent}>
                <Grid container className={classes.taskContainer} spacing={2}>
                    {_.map(tasks, (t) => (
                        <Grid item xs={6}>
                            <Card key={t.id}>
                                <CardHeader
                                    title={
                                        <>
                                            <Typography variant="body1" color="secondary">
                                                {t.fields['System.Title']}
                                            </Typography>
                                            <Typography variant="caption">
                                                Remaining work: {t.fields['Microsoft.VSTS.Scheduling.RemainingWork'] || 0}
                                            </Typography>
                                        </>
                                    }
                                    action={
                                        <Chip
                                            className={classes.taskState}
                                            label={t.fields['System.State']}
                                            style={{ backgroundColor: getStateColor(t.fields['System.State']) }}
                                        />
                                    }
                                />
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="default">
                    Cancel
                </Button>
                <Button type="submit" variant="contained" color="primary" autoFocus>
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};
export interface StoryDetailDialogProps {
    open: boolean;
    handleClose: () => void;
    task: BackLogItem;
    projectId: string;
}

export default StoryDetailDialog;
