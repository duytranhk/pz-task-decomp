import { CardHeader, Card, Chip, IconButton, Typography } from '@material-ui/core';
import { FC, ReactElement } from 'react';
import { DevopsWorkItem } from '../services/shared/azure-devops/azure-devops.models';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';

interface TaskCardProps {
    task: DevopsWorkItem;
    onDelete: (id: number) => void;
}

const useStyles = makeStyles({
    taskState: {
        color: '#fff',
        letterSpacing: 1,
    },
});

const TaskCard: FC<TaskCardProps> = ({ task, onDelete }): ReactElement => {
    const classes = useStyles();
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

    return (
        <Card>
            <CardHeader
                title={
                    <>
                        <Typography variant="body1" color="secondary">
                            {task.fields['System.Title']}
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
