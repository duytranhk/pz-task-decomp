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
        AzureDevopsClient.getIterationWorkItems(projectId, iterationId).then((iItems) => {
            const pbiIds = _.filter(iItems.workItemRelations, (w) => !w.rel && !w.source);
            if (!pbiIds?.length) {
                setProductBackLogItems([]);
                loaderActions.hideLoader(loaderContext.dispatch);
                return;
            }
            AzureDevopsClient.getWorkItems(
                projectId,
                _.map(pbiIds, (p) => p.target!.id)
            ).then((res) => {
                const bli = _.map(res.value, (b) => ({
                    ...b,
                    taskIds: _.filter(iItems.workItemRelations, (i) => i.source?.id === b.id).map((i) => i.target?.id!),
                }));
                setProductBackLogItems(bli);
                loaderActions.hideLoader(loaderContext.dispatch);
            });
        });
    };

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
        await Promise.all(createNewTaskPromises);
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
                    onSubmit={async (nt) => await handleCreateTasks(nt)}
                />
            )}
        </Grid>
    );
};

export default TaskDecompPage;
