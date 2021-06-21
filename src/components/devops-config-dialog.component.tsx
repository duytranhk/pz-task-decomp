import React, { FC, ReactElement, useState } from 'react';
import {
    DialogContent,
    DialogActions,
    Button,
    DialogTitle,
    Dialog,
    TextField,
    Link,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Typography,
} from '@material-ui/core';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { AzureDevopsConfig } from '../contexts/azure-devops/azure-devops.model';
import { useAzureDevopsContext, azureDevopsActions } from '../contexts/azure-devops/azure-devops.context';
import { ActionTypes } from '../contexts/azure-devops/azure-devops.reducer';

const DevopsConfigDialog: FC<DevopsConfigDialogProps> = (props): ReactElement => {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<AzureDevopsConfig>();
    const {
        state: { config, hasConfigured, teams, projects },
        dispatch,
    } = useAzureDevopsContext();
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        if (hasConfigured && (!projects.length || !teams.length)) {
            Promise.all([azureDevopsActions.loadProjects()(dispatch), azureDevopsActions.loadTeams()(dispatch)]).then();
        }
    }, []);

    const onSubmit: SubmitHandler<AzureDevopsConfig> = (data: AzureDevopsConfig) => {
        azureDevopsActions.setConfig(data)(dispatch);
        Promise.all([azureDevopsActions.loadProjects()(dispatch), azureDevopsActions.loadTeams()(dispatch)])
            .then(([p, t]) => {
                setHasError(false);
                if (p.find((pr) => pr.id === data.selectedProjectId && t.find((te) => te.id === data.selectedTeamId))) {
                    dispatch({ type: ActionTypes.VALIDATE_CONFIG, payload: true });
                    props.handleClose();
                }
            })
            .catch(() => {
                setHasError(true);
                dispatch({ type: ActionTypes.SET_PROJECT, payload: [] });
                dispatch({ type: ActionTypes.SET_TEAM, payload: [] });
                dispatch({ type: ActionTypes.VALIDATE_CONFIG, payload: false });
            });
    };

    return (
        <Dialog open={props.open} onClose={props.handleClose} fullWidth maxWidth="xs" disableBackdropClick>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogTitle>Azure Devops Configuration</DialogTitle>
                <DialogContent>
                    <Controller
                        name="endpoint"
                        control={control}
                        defaultValue={config?.endpoint || ''}
                        rules={{ required: 'Organisation Url is required' }}
                        render={({ field }) => (
                            <TextField
                                label="Your organisation URL"
                                margin="normal"
                                type="text"
                                {...field}
                                placeholder="https://dev.azure.com/{your-project-name}"
                                fullWidth
                                error={!!errors.endpoint}
                            />
                        )}
                    />
                    <Controller
                        name="accessToken"
                        control={control}
                        defaultValue={config?.accessToken || ''}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <TextField
                                label="Your personal access token"
                                margin="normal"
                                type="password"
                                {...field}
                                fullWidth
                                error={!!errors.accessToken}
                                helperText={
                                    <Link
                                        href="https://docs.microsoft.com/en-us/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate"
                                        target="_blank"
                                    >
                                        How to get personal access token?
                                    </Link>
                                }
                            />
                        )}
                    />
                    {hasError && (
                        <Typography variant="caption" color="error">
                            Unable to verify your setting. Try again
                        </Typography>
                    )}
                    {!!projects?.length && (
                        <Controller
                            name="selectedProjectId"
                            control={control}
                            defaultValue={config?.selectedProjectId || ''}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <FormControl fullWidth margin="normal" error={!!errors.selectedProjectId}>
                                    <InputLabel id="select-project">Your Project</InputLabel>
                                    <Select {...field} labelId="select-project">
                                        {projects.map((p) => (
                                            <MenuItem key={p.id} value={p.id}>
                                                {p.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )}
                        />
                    )}
                    {!!teams?.length && (
                        <Controller
                            name="selectedTeamId"
                            control={control}
                            defaultValue={config?.selectedTeamId || ''}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <FormControl fullWidth margin="normal" error={!!errors.selectedTeamId}>
                                    <InputLabel id="select-teams">Your Teams</InputLabel>
                                    <Select {...field} labelId="select-teams">
                                        {teams.map((p) => (
                                            <MenuItem key={p.id} value={p.id}>
                                                {p.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.handleClose} color="default">
                        Cancel
                    </Button>
                    <Button type="submit" variant="contained" color="primary" autoFocus>
                        {projects?.length ? 'Save' : 'Verify'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};
export interface DevopsConfigDialogProps {
    open: boolean;
    handleClose: () => void;
}

export default DevopsConfigDialog;
