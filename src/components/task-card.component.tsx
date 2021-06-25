import { CardHeader, Card, Chip, IconButton, Typography } from '@material-ui/core';
import { FC, ReactElement } from 'react';
import { DevopsWorkItem } from '../services/shared/azure-devops/azure-devops.models';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import { APP_COLORS } from '../utils/constants';
import { EditText } from 'react-edit-text';

interface TaskCardProps {
    task: DevopsWorkItem;
    onDelete: (id: number) => void;
}

const useStyles = makeStyles((theme) => ({
    taskState: {
        color: '#fff',
        letterSpacing: 1,
    },
    taskName: {
        color: theme.palette.secondary.main,
        width: '99%',
        cursor: 'pointer',
        padding: '5px 0',
        outline: 'none',
        border: 'none',
        minHeight: 30,
        fontSize: '1rem',
        '&:hover, &:focus': {
            background: '#f4f4f4',
        },
    },
}));

const TaskCard: FC<TaskCardProps> = ({ task, onDelete }): ReactElement => {
    const classes = useStyles();
    const getStateColor = (state?: string): string => {
        if (!state) return '';
        switch (state.toLowerCase()) {
            case 'to do':
                return APP_COLORS.todo;
            case 'in progress':
                return APP_COLORS.inprogress;
            case 'done':
                return APP_COLORS.done;
        }
        return '';
    };

    const handleTaskNameSave = ({ value }: any) => {
        task.fields['System.Title'] = value;
    };

    return (
        <Card>
            <CardHeader
                title={
                    <>
                        <Typography variant="body1" color="secondary">
                            <EditText
                                name="task-title"
                                className={classes.taskName}
                                type="text"
                                defaultValue={task.fields['System.Title']}
                                placeholder="No Title"
                                inline
                                onSave={handleTaskNameSave}
                            />
                        </Typography>
                        <Typography variant="caption">
                            Remaining work: {task.fields['Microsoft.VSTS.Scheduling.RemainingWork'] || 0}
                        </Typography>
                        <br />
                        <Chip
                            className={classes.taskState}
                            size="small"
                            label={task.fields['System.State']}
                            style={{ backgroundColor: getStateColor(task.fields['System.State']) }}
                        />
                    </>
                }
                action={
                    task.id < 0 && (
                        <IconButton aria-label="delete" onClick={() => onDelete(task.id)}>
                            <DeleteIcon />
                        </IconButton>
                    )
                }
            />
        </Card>
    );
};

export default TaskCard;
