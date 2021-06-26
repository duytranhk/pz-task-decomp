import React, { FC, ReactElement, useState } from 'react';
import {
    DialogContent,
    DialogActions,
    Button,
    DialogTitle,
    Dialog,
    Grid,
    Typography,
    MenuItem,
    Menu,
    useMediaQuery,
    IconButton,
    Link,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import BugIcon from '@material-ui/icons/BugReport';
import WebIcon from '@material-ui/icons/Web';
import StorageIcon from '@material-ui/icons/Storage';
import AssignmentIcon from '@material-ui/icons/Assignment';
import CodeIcon from '@material-ui/icons/Code';
import { useEffect } from 'react';
import { BackLogItem, DevopsWorkItem } from '../services/shared/azure-devops/azure-devops.models';
import AzureDevopsClient from '../services/shared/azure-devops/azure-devops.client';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import _ from 'lodash';
import { GenerateTaskType } from '../contexts/azure-devops/azure-devops.model';
import { DEFAULT_TASKS } from '../utils/constants';
import { loaderActions, useLoaderContext } from '../contexts/loader/loader.context';
import TaskCard from './task-card.component';
import { azureDevopsActions, useAzureDevopsContext } from '../contexts/azure-devops/azure-devops.context';
const useStyles = makeStyles({
    dialogContent: {},
    taskContainer: {
        paddingTop: 5,
    },
    taskState: {
        color: '#fff',
        letterSpacing: 1,
    },
    generateBtn: {
        marginLeft: 'auto',
        marginBottom: 'auto',
    },
    header: {
        display: 'flex',
    },
    noTaskContainer: {
        textAlign: 'center',
    },
    taskIcon: {
        marginRight: '1rem',
    },
});
const StoryDetailDialog: FC<StoryDetailDialogProps> = ({ story, projectId, open, handleClose, onSubmit }): ReactElement => {
    const classes = useStyles();
    const loaderContext = useLoaderContext();
    const {
        state: { config },
    } = useAzureDevopsContext();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [tasks, setTasks] = useState<DevopsWorkItem[]>([]);
    const [removedTasks, setRemovedTasks] = useState<DevopsWorkItem[]>([]);
    const [editedTasks, setEditedTasks] = useState<DevopsWorkItem[]>([]);
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

    const handleSave = async () => {
        const newTasks = _.filter(tasks, (t) => t.id < 0);
        await onSubmit(newTasks, editedTasks, removedTasks);
        handleClose();
    };

    const handleDeleteTask = (taskId: number) => {
        const removedTask = _.find(tasks, (t) => t.id === taskId);
        if (removedTask) {
            if (removedTask.id > 0) {
                removedTasks.push(removedTask);
                setRemovedTasks(removedTasks);
            }
            setTasks(_.filter(tasks, (t) => t.id !== removedTask.id));
            setEditedTasks(_.filter(editedTasks, (t) => t.id !== removedTask.id));
        }
    };

    const handleEditTask = (task: DevopsWorkItem) => {
        if (task.id > 0) {
            var taskIndex = _.findIndex(editedTasks, (t) => t.id === task.id);
            if (taskIndex >= 0) editedTasks[taskIndex] = task;
            else editedTasks.push(task);
            setEditedTasks(editedTasks);
        }
    };

    return (
        <Dialog open={open} fullScreen={fullScreen} onClose={handleClose} fullWidth maxWidth="md" disableBackdropClick>
            <DialogTitle>
                <div className={classes.header}>
                    <Link href={azureDevopsActions.getWorkItemUrl(config!, story.id)} target="_blank">
                        {story.fields['System.Title']}
                    </Link>

                    <IconButton
                        className={classes.generateBtn}
                        color="primary"
                        aria-controls="generate-task-menu"
                        aria-haspopup="true"
                        onClick={handleClick}
                    >
                        <AddIcon />
                    </IconButton>
                    <Menu id="generate-task-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleCloseMenu}>
                        <MenuItem onClick={() => onGenerateTaskClick(GenerateTaskType.Common)}>
                            <CodeIcon className={classes.taskIcon} />
                            Common tasks
                        </MenuItem>
                        <MenuItem onClick={() => onGenerateTaskClick(GenerateTaskType.API)}>
                            <StorageIcon className={classes.taskIcon} />
                            API tasks
                        </MenuItem>
                        <MenuItem onClick={() => onGenerateTaskClick(GenerateTaskType.UI)}>
                            <WebIcon className={classes.taskIcon} />
                            UI tasks
                        </MenuItem>
                        <MenuItem onClick={() => onGenerateTaskClick(GenerateTaskType.Bug)}>
                            <BugIcon className={classes.taskIcon} />
                            Bug tasks
                        </MenuItem>
                        <MenuItem onClick={() => onGenerateTaskClick(GenerateTaskType.Single)}>
                            <AssignmentIcon className={classes.taskIcon} />
                            Single task
                        </MenuItem>
                    </Menu>
                </div>
            </DialogTitle>
            <DialogContent className={classes.dialogContent}>
                <Grid container className={classes.taskContainer} spacing={2}>
                    {_.map(tasks, (t) => (
                        <Grid item xs={12} sm={6} key={t.id}>
                            <TaskCard task={t} onDelete={handleDeleteTask} onEdit={handleEditTask} />
                        </Grid>
                    ))}
                    {!tasks.length && (
                        <Grid item xs={12} className={classes.noTaskContainer}>
                            <AssignmentIcon color="secondary" fontSize="large" />
                            <Typography variant="body1" color="secondary">
                                No tasks to show
                            </Typography>
                        </Grid>
                    )}
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="default">
                    Close
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
    onSubmit: (newTasks: DevopsWorkItem[], updatedTasks: DevopsWorkItem[], deletedTasks: DevopsWorkItem[]) => Promise<void>;
    story: BackLogItem;
    projectId: string;
}

export default StoryDetailDialog;
