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
    IconButton,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import TaskIcon from '@material-ui/icons/Assignment';
import { useEffect } from 'react';
import { BackLogItem, DevopsWorkItem } from '../services/shared/azure-devops/azure-devops.models';
import AzureDevopsClient from '../services/shared/azure-devops/azure-devops.client';
import { makeStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import { GenerateTaskType } from '../contexts/azure-devops/azure-devops.model';
import { DefaultTasks } from '../utils/constants';
import { loaderActions, useLoaderContext } from '../contexts/loader/loader.context';
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
const StoryDetailDialog: FC<StoryDetailDialogProps> = ({ task, projectId, open, handleClose, onSubmit }): ReactElement => {
    const classes = useStyles();
    const loaderContext = useLoaderContext();
    const [tasks, setTasks] = useState<DevopsWorkItem[]>([]);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    useEffect(() => {
        if (task?.taskIds?.length > 0) {
            loaderActions.showLoader(loaderContext.dispatch);
            AzureDevopsClient.getWorkItems(projectId, task.taskIds).then((res) => {
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
    }, [task, projectId]);

    const getStateColor = (state?: string): string => {
        if (!state) return '';
        switch (state.toLowerCase()) {
            case 'to do':
                return '#FF5722';
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

    const onGenerateTaskClick = (type: GenerateTaskType) => {
        switch (type) {
            case GenerateTaskType.API:
            case GenerateTaskType.UI:
            case GenerateTaskType.Common:
                const newTasks = _.map(
                    _.filter(DefaultTasks[type], (n) => !_.some(tasks, (t) => t.fields['System.Title'] === n)),
                    (name, index) => createNewTask(name, index)
                );
                setTasks([...tasks, ...newTasks]);
                break;
            case GenerateTaskType.Single:
                const newTask = createNewTask('Single Task');
                tasks.push(newTask);
                setTasks(tasks);
                break;
        }
        handleCloseMenu();
    };

    const createNewTask = (title: string, index: number = 0): DevopsWorkItem => {
        return {
            id: (new Date().getTime() + index) * -1,
            rev: 0,
            url: '',
            fields: {
                'System.Title': title,
                'System.State': 'To Do',
            },
        };
    };

    const handleSave = () => {
        const newTasks = _.filter(tasks, (t) => t.id < 0);
        onSubmit(newTasks);
        handleClose();
    };

    const handleDeleteTask = (task: DevopsWorkItem) => {
        setTasks(_.filter(tasks, (t) => t.id !== task.id));
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
                                            <br />
                                            <Chip
                                                className={classes.taskState}
                                                size="small"
                                                label={t.fields['System.State']}
                                                style={{ backgroundColor: getStateColor(t.fields['System.State']) }}
                                            />
                                        </>
                                    }
                                    action={
                                        t.id < 0 && (
                                            <IconButton aria-label="delete" onClick={() => handleDeleteTask(t)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        )
                                    }
                                />
                            </Card>
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
    task: BackLogItem;
    projectId: string;
}

export default StoryDetailDialog;
