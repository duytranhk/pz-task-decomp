import React, { ReactElement, FC, useState } from 'react';
import { Grid, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useEffect } from 'react';
import { useAzureDevopsContext } from '../contexts/azure-devops/azure-devops.context';
import AzureDevopsClient from '../services/shared/azure-devops/azure-devops.client';
import { DevopsIteration, BackLogItem, DevopsWorkItem } from '../services/shared/azure-devops/azure-devops.models';
import Autocomplete from '@material-ui/lab/Autocomplete';
import _ from 'lodash';
import StoryCard from '../components/story-card.component';
import StoryDetailDialog from '../components/story-detail-dialog.component';
import { useLoaderContext, loaderActions } from '../contexts/loader/loader.context';
import { WorkItemTypes } from '../contexts/azure-devops/azure-devops.model';

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
    },
});
const TaskDecompPage: FC<any> = (): ReactElement => {
    const classes = useStyles();
    const {
        state: { config, isValidated, iterations },
    } = useAzureDevopsContext();
    const loaderContext = useLoaderContext();
    const [productBackLogItems, setProductBackLogItems] = useState<BackLogItem[]>([]);
    const [selectedIterationId, setSelectedIterationId] = useState<string>('');
    const [selectedTask, setSelectedTask] = useState<BackLogItem>();
    const [openTaskDetail, setOpenTaskDetail] = useState<boolean>(false);

    useEffect(() => {
        if (config && isValidated && selectedIterationId) {
            loadData(config.selectedProjectId!, selectedIterationId);
        } else {
            setProductBackLogItems([]);
        }
    }, [config, isValidated, selectedIterationId]);

    const loadData = async (projectId: string, iterationId: string) => {
        loaderActions.showLoader(loaderContext.dispatch);
        const iterationItems = await AzureDevopsClient.getIterationWorkItems(projectId, iterationId);
        const pbiIds = _.map(
            _.filter(iterationItems.workItemRelations, (w) => !w.rel && !!w.target),
            (p) => p.target!.id
        );
        if (!pbiIds?.length) {
            setProductBackLogItems([]);
            loaderActions.hideLoader(loaderContext.dispatch);
            return;
        }
        const pbiResponse = await AzureDevopsClient.getWorkItems(projectId, pbiIds);
        setProductBackLogItems(
            _.map(
                _.filter(pbiResponse.value, (p) => [WorkItemTypes.PBI, WorkItemTypes.BUG].includes(p.fields['System.WorkItemType']!)),
                (bl) => ({
                    ...bl,
                    taskIds: _.filter(iterationItems.workItemRelations, (i) => i.source?.id === bl.id).map((i) => i.target?.id!),
                })
            )
        );
        loaderActions.hideLoader(loaderContext.dispatch);
    };

    const handleTaskClick = (task: BackLogItem) => {
        setSelectedTask(task);
        setOpenTaskDetail(true);
    };

    const handleSubmit = async (newTasks: DevopsWorkItem[], updatedTasks: DevopsWorkItem[], deletedTasks: DevopsWorkItem[]) => {
        if (!config || !selectedTask) return;
        loaderActions.showLoader(loaderContext.dispatch);
        let promises: Promise<any>[] = [];
        if (newTasks.length) {
            const createNewTaskPromises = _.map(newTasks, (t) =>
                AzureDevopsClient.createTask(
                    config.selectedProjectId!,
                    selectedTask.fields['System.IterationPath']!,
                    selectedTask.url,
                    t.fields['System.Title'],
                    t.fields['Microsoft.VSTS.Scheduling.RemainingWork']
                )
            );
            promises = [...promises, ...createNewTaskPromises];
        }
        if (deletedTasks.length) {
            const removeTaskPromises = _.map(deletedTasks, (t) => AzureDevopsClient.deleteWorkItem(t.id));
            promises = [...promises, ...removeTaskPromises];
        }
        if (updatedTasks.length) {
            const updatedTaskPromises = _.map(updatedTasks, (t) =>
                AzureDevopsClient.updateWorkItem(config.selectedProjectId!, t.id, [
                    {
                        op: 'add',
                        path: '/fields/System.Title',
                        value: t.fields['System.Title'],
                    },
                    {
                        op: 'add',
                        path: '/fields/Microsoft.VSTS.Scheduling.RemainingWork',
                        value: t.fields['Microsoft.VSTS.Scheduling.RemainingWork'],
                    },
                ])
            );
            promises = [...promises, ...updatedTaskPromises];
        }

        if (promises.length) {
            await Promise.all(promises);
        }
        await loadData(config.selectedProjectId!, selectedIterationId);

        loaderActions.hideLoader(loaderContext.dispatch);
    };

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
                    <StoryCard story={pbi} onClick={() => handleTaskClick(pbi)} />
                </Grid>
            ))}
            {selectedTask && openTaskDetail && config?.selectedProjectId && (
                <StoryDetailDialog
                    story={selectedTask}
                    open={openTaskDetail}
                    handleClose={() => setOpenTaskDetail(false)}
                    projectId={config.selectedProjectId}
                    onSubmit={handleSubmit}
                />
            )}
        </Grid>
    );
};

export default TaskDecompPage;
