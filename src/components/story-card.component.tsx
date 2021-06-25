import React, { ReactElement, FC } from 'react';
import { Card, makeStyles, Typography, CardHeader, Avatar } from '@material-ui/core';
import { BackLogItem } from '../services/shared/azure-devops/azure-devops.models';
import ArrowIcon from '@material-ui/icons/ArrowForwardIos';
const useStyles = makeStyles({
    root: {
        flexDirection: 'column',
        display: 'flex',
        transition: 'box-shadow 0.3s ease-in',
        cursor: 'pointer',
        '&:hover, &:focus': {
            boxShadow: '0 0 20px 0 rgba(66, 188, 199, 0.45)',
        },
        '& .MuiCardHeader-action': {
            alignSelf: 'center',
            color: '#d2dfec',
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
    taskDetail: {
        display: 'grid',
    },
});

const StoryCard: FC<StoryCardProps> = ({ story, onClick }): ReactElement => {
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
        <Card className={classes.root} onClick={onClick}>
            <CardHeader
                avatar={
                    <Avatar
                        className={classes.avatar}
                        aria-label="recipe"
                        style={{ background: getBackground(story.fields['Microsoft.VSTS.Scheduling.Effort']!) }}
                    >
                        {story.fields['Microsoft.VSTS.Scheduling.Effort'] || '...'}
                    </Avatar>
                }
                title={
                    <div className={classes.taskDetail}>
                        <Typography className={classes.title} variant="subtitle1" color="primary">
                            {story.fields['System.Title']}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                            <strong>Created on:</strong> {new Date(story.fields['System.CreatedDate']!).toLocaleString()}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                            <strong>Updated on:</strong> {new Date(story.fields['System.ChangedDate']!).toLocaleString()}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                            <strong>Subtasks:</strong> {story.taskIds.length}
                        </Typography>
                    </div>
                }
                action={<ArrowIcon />}
            />
        </Card>
    );
};

interface StoryCardProps {
    story: BackLogItem;
    onClick: () => void;
}

export default StoryCard;
