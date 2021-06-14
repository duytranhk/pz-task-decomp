import React, { ReactElement, FC } from 'react';
import { Card, makeStyles, Typography, CardHeader, Avatar } from '@material-ui/core';
import { DevopsWorkItem } from '../services/shared/azure-devops/azure-devops.models';
const useStyles = makeStyles((theme) => ({
    root: {
        flexDirection: 'column',
        display: 'flex',
        transition: 'box-shadow 0.3s ease-in',
        cursor: 'pointer',
        '&:hover, &:focus': {
            boxShadow: '0 0 20px 0 rgba(66, 188, 199, 0.45)',
        },
    },
    cardButtonRow: {
        marginTop: 'auto',
        display: 'flex',
        justifyContent: 'flex-end',
    },
    selected: {
        boxShadow: '0 3px 11px 0 rgb(0 152 167)',
    },
    avatar: {
        backgroundColor: '#009688',
        color: '#414141',
        fontWeight: 550,
        width: 50,
        height: 50,
        fontSize: 23,
    },
    title: {
        textOverflow: 'ellipsis',
        lineHeight: '1.5em',
        height: '3em',
        overflow: 'hidden',
    },
}));

const TaskCard: FC<TaskCardProps> = ({ task }): ReactElement => {
    const classes = useStyles();
    const getBackground = (point: number): string => {
        if (point <= 3) return 'linear-gradient(145deg, #8bc34a 0%, #D6F7B6 100%)';
        if (point <= 5) return 'linear-gradient(145deg, #CDDC39 0%, #F8FFA6 100%)';
        if (point <= 8) return 'linear-gradient(145deg, #FFEB3B 0%, #FFF29A 100%)';
        if (point <= 13) return 'linear-gradient(145deg, #FF9800 0%, #EACE9A 100%)';
        if (point <= 20) return 'linear-gradient(145deg, #FF5722 0%, #F5B29F 100%)';
        if (point > 20) return 'linear-gradient(145deg, #D32F2F 0%, #EE9E9E 100%)';
        return 'linear-gradient(145deg, #A6A6A6 0%, #EAEAEA 100%)';
    };
    return (
        <Card className={classes.root}>
            <CardHeader
                avatar={
                    <Avatar
                        className={classes.avatar}
                        aria-label="recipe"
                        style={{ background: getBackground(task.fields['Microsoft.VSTS.Scheduling.Effort']) }}
                    >
                        {task.fields['Microsoft.VSTS.Scheduling.Effort'] || '...'}
                    </Avatar>
                }
                title={
                    <div>
                        <Typography className={classes.title} variant="subtitle1" color="primary">
                            {task.fields['System.Title']}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                            Created on: {new Date(task.fields['System.CreatedDate']).toLocaleString()}
                        </Typography>
                        <br />
                        <Typography variant="caption" color="textSecondary">
                            Updated on: {new Date(task.fields['System.ChangedDate']).toLocaleString()}
                        </Typography>
                    </div>
                }
            />
        </Card>
    );
};

interface TaskCardProps {
    task: DevopsWorkItem;
}

export default TaskCard;
