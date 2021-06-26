import { CardHeader, Card, Chip, IconButton, Typography, Badge, Slider } from '@material-ui/core';
import { FC, ReactElement } from 'react';
import { DevopsWorkItem } from '../services/shared/azure-devops/azure-devops.models';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import { APP_COLORS } from '../utils/constants';
import { EditText } from 'react-edit-text';

interface TaskCardProps {
    task: DevopsWorkItem;
    onDelete: (id: number) => void;
    onEdit: (task: DevopsWorkItem) => void;
}

const useStyles = makeStyles((theme) => ({
    taskState: {
        color: '#fff',
        letterSpacing: 1,
    },
    taskNameContainer: {
        '& > input': {
            padding: '5px 10px',
            width: '94%',
        },
    },
    taskName: {
        color: theme.palette.secondary.main,
        width: '99%',
        cursor: 'pointer',
        padding: '5px 0',
        outline: 'none',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        minHeight: 30,
        fontSize: '1rem',
        '&:hover, &:focus': {
            background: '#f4f4f4',
        },
    },
    cardBadge: {
        width: '100%',
        '& > div': {
            width: '100%',
        },
    },
    workContainer: {
        display: 'grid',
        gridTemplateColumns: 'max-content 1fr',
        gridGap: '1.3rem',
        justifyContent: 'center',
        alignItems: 'center',
    },
}));

const WorkSlider = withStyles({
    root: {
        height: 8,
    },
    thumb: {
        height: 24,
        width: 24,
        backgroundColor: '#fff',
        border: '2px solid currentColor',
        marginTop: -8,
        marginLeft: -12,
        '&:focus, &:hover, &$active': {
            boxShadow: 'inherit',
        },
    },
    mark: {
        display: 'none',
    },
    valueLabel: {
        left: 'calc(-50% + 4px)',
    },
    track: {
        height: 8,
        borderRadius: 4,
    },
    rail: {
        height: 8,
        borderRadius: 4,
    },
    active: {}
})(Slider);

const TaskCard: FC<TaskCardProps> = ({ task, onDelete, onEdit }): ReactElement => {
    const classes = useStyles();
    const workHours = [
        {
            value: 0,
        },
        {
            value: 0.5,
        },
        {
            value: 1,
        },
        {
            value: 2,
        },
        {
            value: 3,
        },
    ];

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
        onEdit(task);
    };

    const handleWorkHourChange = (event: any, newValue: number | number[]) => {
        task.fields['Microsoft.VSTS.Scheduling.RemainingWork'] = newValue as number;
        onEdit(task);
    };

    return (
        <Badge color="primary" badgeContent={task.id < 0 ? 'New' : undefined} className={classes.cardBadge}>
            <Card>
                <CardHeader
                    title={
                        <>
                            <div className={classes.taskNameContainer}>
                                <EditText
                                    name="task-title"
                                    className={classes.taskName}
                                    type="text"
                                    defaultValue={task.fields['System.Title']}
                                    placeholder="No Title"
                                    inline
                                    onSave={handleTaskNameSave}
                                />
                            </div>
                            <div className={classes.workContainer}>
                                <Typography variant="caption" id="work-hour-slider">
                                    Remaining work:
                                </Typography>
                                <WorkSlider
                                    defaultValue={task.fields['Microsoft.VSTS.Scheduling.RemainingWork']}
                                    aria-labelledby="work-hour-slider"
                                    step={null}
                                    min={0}
                                    max={3}
                                    valueLabelDisplay="auto"
                                    marks={workHours}
                                    onChange={handleWorkHourChange}
                                />
                            </div>
                            <Chip
                                className={classes.taskState}
                                size="small"
                                label={task.fields['System.State']}
                                style={{ backgroundColor: getStateColor(task.fields['System.State']) }}
                            />
                        </>
                    }
                    action={
                        <IconButton aria-label="delete" onClick={() => onDelete(task.id)}>
                            <DeleteIcon color="secondary"/>
                        </IconButton>
                    }
                />
            </Card>
        </Badge>
    );
};

export default TaskCard;
