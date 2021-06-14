import React, { ReactElement, FC, useState } from 'react';
import { Card, Grid, TextField, CardContent, Typography, CardActions, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useEffect } from 'react';
import { useContext } from 'react';
import { AzureDevopsContext } from '../contexts/azure-devops.context';
import AzureDevopsClient from '../services/shared/azure-devops/azure-devops.client';
import { DevopsIteration, DevopsWorkItem } from '../services/shared/azure-devops/azure-devops.models';
import Autocomplete from '@material-ui/lab/Autocomplete';
import _ from 'lodash';
const useStyles = makeStyles({
    root: {
        flexGrow: 1,
    },
    card: {
        minHeight: 200,
        flexDirection: 'column',
        display: 'flex',
    },
    cardButtonRow: {
        marginTop: 'auto',
        display: 'flex',
        justifyContent: 'flex-end',
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
                    id="combo-box-demo"
                    options={iterations}
                    getOptionLabel={(option) => option.name}
                    style={{ width: 300 }}
                    onChange={(event, value) => handleChangeSelectedIterationId(value!)}
                    renderInput={(params) => <TextField {...params} label="Select Iteration" />}
                />
            </Grid>
            {_.map(productBackLogItems, (pbi) => (
                <Grid item xs={6} key={pbi.id}>
                    <Card className={classes.card}>
                        <CardContent>
                            <Typography variant="h6" color="primary">
                                {pbi.fields['System.Title']}
                            </Typography>
                        </CardContent>
                        <CardActions className={classes.cardButtonRow}>
                            <Button variant="outlined" color="primary" size="small">
                                Decomp
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default TaskDecompPage;
