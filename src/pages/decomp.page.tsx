import React, { ReactElement, FC, useState } from 'react';
import { Grid, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useEffect } from 'react';
import { useContext } from 'react';
import { AzureDevopsContext } from '../contexts/azure-devops.context';
import AzureDevopsClient from '../services/shared/azure-devops/azure-devops.client';
import { DevopsIteration, DevopsWorkItem } from '../services/shared/azure-devops/azure-devops.models';
import Autocomplete from '@material-ui/lab/Autocomplete';
import _ from 'lodash';
import TaskCard from '../components/task-card.component';
const useStyles = makeStyles({
    root: {
        flexGrow: 1,
    },
});
const TaskDecompPage: FC<any> = (): ReactElement => {
    const classes = useStyles();
    const { config, hasConfigured } = useContext(AzureDevopsContext);
    const [iterations, setIterations] = useState<DevopsIteration[]>([]);
    const [productBackLogItems, setProductBackLogItems] = useState<DevopsWorkItem[]>([]);
    const [selectedIterationId, setSelectedIterationId] = useState<string>('');
    useEffect(() => {
        if (hasConfigured && config) {
            AzureDevopsClient.getIterations(config.selectedProjectId!, config.selectedTeamId!).then((res) => {
                setIterations(res.value);
            });
        }
    }, [config, hasConfigured]);

    useEffect(() => {
        if (config && hasConfigured && selectedIterationId) {
            AzureDevopsClient.getIterationWorkItems(config.selectedProjectId!, config.selectedTeamId!, selectedIterationId).then((res) => {
                const pbi = _.filter(res.workItemRelations, (w) => !w.rel && !w.source);
                AzureDevopsClient.getWorkItems(
                    config.selectedProjectId!,
                    _.map(pbi, (p) => p.target!.id)
                ).then((res) => {
                    setProductBackLogItems(res.value);
                });
            });
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
                            variant="outlined"
                            label="Select Iteration"
                            helperText={productBackLogItems.length ? `${productBackLogItems.length} items` : ''}
                        />
                    )}
                />
            </Grid>
            {_.map(productBackLogItems, (pbi) => (
                <Grid item xs={12} sm={6} lg={4} key={pbi.id}>
                    <TaskCard task={pbi} />
                </Grid>
            ))}
        </Grid>
    );
};

export default TaskDecompPage;
