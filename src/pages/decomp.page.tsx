import React, { ReactElement, FC, useState } from 'react';
import { Grid, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useEffect } from 'react';
import { useContext } from 'react';
import { AzureDevopsContext } from '../contexts/azure-devops.context';
import AzureDevopsClient from '../services/shared/azure-devops/azure-devops.client';
import { DevopsIteration } from '../services/shared/azure-devops/azure-devops.models';
import Autocomplete from '@material-ui/lab/Autocomplete';
const useStyles = makeStyles({
    root: {
        flexGrow: 1,
    },
});
const TaskDecompPage: FC<any> = (): ReactElement => {
    const classes = useStyles();
    const { config } = useContext(AzureDevopsContext);
    const [iterations, setIterations] = useState<DevopsIteration[]>([]);
    const [selectedIterationId, setSelectedIterationId] = useState<string>('');
    useEffect(() => {
        if (config?.selectedProjectId) {
            AzureDevopsClient.getIterations(config.selectedProjectId!, config.selectedTeamId!).then((res) => {
                setIterations(res.value);
            });
        }
    }, [config]);

    useEffect(() => {
        if (config?.selectedProjectId && selectedIterationId) {
            AzureDevopsClient.getIterationWorkItems(config.selectedProjectId!, config.selectedTeamId!, selectedIterationId).then((res) => {
                console.log(res);
            });
        }
    }, [config, selectedIterationId]);

    const handleChangeSelectedIterationId = (value: DevopsIteration) => {
        setSelectedIterationId(value?.id!);
    };
    return (
        <Grid container className={classes.root} spacing={2}>
            <Grid item xs={12} md={4}>
                <Autocomplete
                    id="combo-box-demo"
                    options={iterations}
                    getOptionLabel={(option) => option.name}
                    style={{ width: 300 }}
                    onChange={(event, value) => handleChangeSelectedIterationId(value!)}
                    renderInput={(params) => <TextField {...params} label="Combo box" variant="outlined" />}
                />
            </Grid>
        </Grid>
    );
};

export default TaskDecompPage;
