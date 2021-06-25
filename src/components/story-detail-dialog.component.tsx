import React, { FC, ReactElement, useState } from 'react';
import { DialogContent, DialogActions, Button, DialogTitle, Dialog, Grid, Typography, MenuItem, Menu } from '@material-ui/core';
import TaskIcon from '@material-ui/icons/Assignment';
import { useEffect } from 'react';
import { BackLogItem, DevopsWorkItem } from '../services/shared/azure-devops/azure-devops.models';
import AzureDevopsClient from '../services/shared/azure-devops/azure-devops.client';
import { makeStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import { GenerateTaskType } from '../contexts/azure-devops/azure-devops.model';
import { DEFAULT_TASKS } from '../utils/constants';
import { loaderActions, useLoaderContext } from '../contexts/loader/loader.context';
import TaskCard from './task-card.component';
import { azureDevopsActions } from '../contexts/azure-devops/azure-devops.context';
const useStyles = makeStyles({
    dialogContent: {},
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
    noTaskContainer: {
        textAlign: 'center',
    },
});
const StoryDetailDialog: FC<StoryDetailDialogProps> = ({ story, projectId, open, handleClose, onSubmit }): ReactElement => {
    const classes = useStyles();
    const loaderContext = useLoaderContext();
    const [tasks, setTasks] = useState<DevopsWorkItem[]>([]);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    useEffect(() => {
        if (story?.taskIds?.length > 0) {
            loaderActions.showLoader(loaderContext.dispatch);
            AzureDevopsClient.getWorkItems(projectId, story.taskIds).then((res) => {
                setTasks(
                    _.orderBy(res.value, (v) => {
                        if (v.fields['System.State']?.toLocaleLowerCase() === 'to do') return 0;
                        if (v.fields['System.State']?.toLocaleLowerCase() === 'in progress') return 1;
                        if (v.fields['System.State']?.toLocaleLowerCase() === 'done') return 2;
                        return 3;
                    })
                );
                loaderActions.hideLoader(loaderContext.dispatch);
            });
        }
    }, [story, projectId]);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const onGenerateTaskClick = (type: GenerateTaskType) => {
        const newTasks = _.map(DEFAULT_TASKS[type], (name, index) =>
            azureDevopsActions.createNewTasks(name, +`-${new Date().getTime()}${index}`)
        );
        setTasks([...tasks, ...newTasks]);
        handleCloseMenu();
    };

    const handleSave = () => {
        const newTasks = _.filter(tasks, (t) => t.id < 0);
        onSubmit(newTasks);
        handleClose();
    };

    const handleDeleteTask = (taskId: number) => {
        setTasks(_.filter(tasks, (t) => t.id !== taskId));
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md" disableBackdropClick>
            <DialogTitle>
                <div className={classes.header}>
                    {story.fields['System.Title']}
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
                        <MenuItem onClick={() => onGenerateTaskClick(GenerateTaskType.Common)}>Common tasks</MenuItem>
                        <MenuItem onClick={() => onGenerateTaskClick(GenerateTaskType.API)}>API tasks</MenuItem>
                        <MenuItem onClick={() => onGenerateTaskClick(GenerateTaskType.UI)}>UI tasks</MenuItem>
                        <MenuItem onClick={() => onGenerateTaskClick(GenerateTaskType.Single)}>Single task</MenuItem>
                    </Menu>
                </div>
            </DialogTitle>
            <DialogContent className={classes.dialogContent}>
                <Grid container className={classes.taskContainer} spacing={2}>
                    {_.map(tasks, (t) => (
                        <Grid item xs={6} key={t.id}>
                            <TaskCard task={t} onDelete={(taskId) => handleDeleteTask(taskId)} />
                        </Grid>
                    ))}
                    {!tasks.length && (
                        <Grid item xs={12} className={classes.noTaskContainer}>
                            <TaskIcon color="secondary" fontSize="large" />
                            <Typography variant="body1" color="secondary">
                                No tasks to show
                            </Typography>
                        </Grid>
                    )}
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="default">
                    Cancel
                </Button>
                <Button variant="contained" color="primary" autoFocus onClick={handleSave}>
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};
export interface StoryDetailDialogProps {
    open: boolean;
    handleClose: () => void;
    onSubmit: (newTasks: DevopsWorkItem[]) => void;
    story: BackLogItem;
    projectId: string;
}

export default StoryDetailDialog;
