import React, { FC, ReactElement, useContext, useState } from 'react';
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
import { AzureDevopsConfig, AzureDevopsContext } from '../contexts/azure-devops.context';
import { useEffect } from 'react';
import { DevopsProject, DevopsTeams } from '../services/shared/azure-devops/azure-devops.models';
import AzureDevopsClient from '../services/shared/azure-devops/azure-devops.client';
import UtilService from '../services/util.service';

const DevopsConfigDialog: FC<DevopsConfigDialogProps> = (props): ReactElement => {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<AzureDevopsConfig>();
    const [hasError, setHasError] = useState(false);
    const [projects, setProjects] = useState<DevopsProject[]>();
    const [teams, setTeams] = useState<DevopsTeams[]>();
    const { config, hasConfigured, setConfig, setHasConfigured } = useContext(AzureDevopsContext);

    useEffect(() => {
        if (hasConfigured) {
            AzureDevopsClient.getProjects().then((res) => {
                setProjects(res.value);
            });
            AzureDevopsClient.getTeams().then((res) => {
                setTeams(res.value);
            });
        }
    }, []);

    const onSubmit: SubmitHandler<AzureDevopsConfig> = async (data: AzureDevopsConfig) => {
        UtilService.saveStorageItem('@app:azure-config', data);
        setConfig(data);
        const getProject = AzureDevopsClient.getProjects().then((r) => {
            setProjects(r.value);
            return r.value;
        });
        const getTeams = AzureDevopsClient.getTeams().then((r) => {
            setTeams(r.value);
            return r.value;
        });
        Promise.all([getProject, getTeams])
            .then(([p, t]) => {
                setHasError(false);
                if (p.find((pr) => pr.id === data.selectedProjectId && t.find((te) => te.id === data.selectedTeamId))) {
                    setHasConfigured(true);
                    props.handleClose();
                }
            })
            .catch(() => {
                setHasError(true);
                setProjects([]);
                setTeams([]);
                setHasConfigured(false);
            });
    };

    return (
        <Dialog open={props.open} onClose={props.handleClose} fullWidth maxWidth="xs">
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
