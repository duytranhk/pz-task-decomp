import React, { ReactElement, FC, useState } from 'react';
import { Grid, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useEffect } from 'react';
import { useAzureDevopsContext } from '../contexts/azure-devops/azure-devops.context';
import AzureDevopsClient from '../services/shared/azure-devops/azure-devops.client';
import { DevopsIteration, BackLogItem, DevopsWorkItem } from '../services/shared/azure-devops/azure-devops.models';
import Autocomplete from '@material-ui/lab/Autocomplete';
import _ from 'lodash';
import TaskCard from '../components/task-card.component';
import StoryDetailDialog from '../components/story-detail-dialog.component';
import { useLoaderContext, loaderActions } from '../contexts/loader/loader.context';

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
    },
});
const TaskDecompPage: FC<any> = (): ReactElement => {
    const classes = useStyles();
    const {
        state: { config, hasConfigured },
    } = useAzureDevopsContext();
    const loaderContext = useLoaderContext();
    const [iterations, setIterations] = useState<DevopsIteration[]>([]);
    const [productBackLogItems, setProductBackLogItems] = useState<BackLogItem[]>([]);
    const [selectedIterationId, setSelectedIterationId] = useState<string>('');
    const [selectedTask, setSelectedTask] = useState<BackLogItem>();
    const [openTaskDetail, setOpenTaskDetail] = useState<boolean>(false);

    useEffect(() => {
        if (hasConfigured && config) {
            loaderActions.showLoader(loaderContext.dispatch);
            AzureDevopsClient.getIterations(config.selectedProjectId!, config.selectedTeamId!).then((res) => {
                setIterations(res.value);
                loaderActions.hideLoader(loaderContext.dispatch);
            });
        }
    }, [config, hasConfigured]);

    const handleTaskClick = (task: BackLogItem) => {
        setSelectedTask(task);
        setOpenTaskDetail(true);
    };

    const handleCreateTasks = async (newTasks: DevopsWorkItem[]) => {
        if (!config || !selectedTask) return;
        const createNewTaskPromises = _.map(newTasks, (t) =>
            AzureDevopsClient.createTask(
                config.selectedProjectId!,
                selectedTask.fields['System.IterationPath']!,
                selectedTask.url,
                t.fields['System.Title']!
            )
        );
        loaderActions.showLoader(loaderContext.dispatch);
        const result = await Promise.all(createNewTaskPromises);
        loaderActions.hideLoader(loaderContext.dispatch);
        _.each(productBackLogItems, (pbi) => {
            if (pbi.id === selectedTask.id) {
                pbi.taskIds = [...pbi.taskIds!, ..._.map(result, (r) => r.id)];
            }
        });
        setProductBackLogItems(productBackLogItems);
    };

    useEffect(() => {
        if (config && hasConfigured && selectedIterationId) {
            loaderActions.showLoader(loaderContext.dispatch);
            AzureDevopsClient.getIterationWorkItems(config.selectedProjectId!, config.selectedTeamId!, selectedIterationId).then(
                (iItems) => {
                    const pbiIds = _.filter(iItems.workItemRelations, (w) => !w.rel && !w.source);
                    if (!pbiIds?.length) {
                        setProductBackLogItems([]);
                        loaderActions.hideLoader(loaderContext.dispatch);
                        return;
                    }
                    AzureDevopsClient.getWorkItems(
                        config.selectedProjectId!,
                        _.map(pbiIds, (p) => p.target!.id)
                    ).then((res) => {
                        const bli = _.map(res.value, (b) => ({
                            ...b,
                            taskIds: _.filter(iItems.workItemRelations, (i) => i.source?.id === b.id).map((i) => i.target?.id!),
                        }));
                        setProductBackLogItems(bli);
                        loaderActions.hideLoader(loaderContext.dispatch);
                    });
                }
            );
        } else {
            setProductBackLogItems([]);
        }
    }, [config, hasConfigured, selectedIterationId]);

    const handleChangeSelectedIterationId = (value: DevopsIteration) => {
        setSelectedIterationId(value?.id!);
    };
    return (
        <Grid container className={classes.root} spacing={2}>
            <Grid item xs={12}>
                <Autocomplete
                    id="select-iteration"
                    options={iterations}
                    getOptionLabel={(option) => option.name}
                    style={{ width: 300 }}
                    onChange={(event, value) => handleChangeSelectedIterationId(value!)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            size="medium"
                            variant="outlined"
                            label="Select Iteration"
                            helperText={productBackLogItems.length ? `${productBackLogItems.length} items` : ''}
                        />
                    )}
                />
            </Grid>
            {_.map(productBackLogItems, (pbi) => (
                <Grid item xs={12} sm={6} lg={4} key={pbi.id}>
                    <TaskCard task={pbi} onTaskClick={() => handleTaskClick(pbi)} />
                </Grid>
            ))}
            {selectedTask && openTaskDetail && config?.selectedProjectId && (
                <StoryDetailDialog
                    task={selectedTask}
                    open={openTaskDetail}
                    handleClose={() => setOpenTaskDetail(false)}
                    projectId={config.selectedProjectId}
                    onSubmit={async (nt) => await handleCreateTasks(nt)}
                />
            )}
        </Grid>
    );
};

export default TaskDecompPage;
