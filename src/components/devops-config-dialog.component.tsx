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
import { AzureDevopsConfig } from '../contexts/azure-devops/azure-devops.model';
import { useAzureDevopsContext, azureDevopsActions } from '../contexts/azure-devops/azure-devops.context';
import { loaderActions, useLoaderContext } from '../contexts/loader/loader.context';

const DevopsConfigDialog: FC<DevopsConfigDialogProps> = (props): ReactElement => {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<AzureDevopsConfig>();
    const {
        state: { config, projects },
        dispatch,
    } = useAzureDevopsContext();
    const loaderContext = useLoaderContext();
    const [hasError, setHasError] = useState(false);

    const onSubmit: SubmitHandler<AzureDevopsConfig> = async (data: AzureDevopsConfig) => {
        setHasError(false);
        loaderActions.showLoader(loaderContext.dispatch);

        if (config?.endpoint !== data.endpoint || config?.accessToken !== data.accessToken) {
            data.selectedProjectId = '';
        }

        if (await azureDevopsActions.validate(data)(dispatch)) {
            data.selectedProjectId && props.handleClose();
        } else {
            setHasError(true);
        }
        loaderActions.hideLoader(loaderContext.dispatch);
    };

    return (
        <Dialog open={props.open} onClose={props.handleClose} fullWidth maxWidth="xs" disableBackdropClick>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogTitle>
                    Azure Devops Configuration
                    <br />
                    {hasError && (
                        <Typography variant="caption" color="error">
                            Unable to verify your setting. Try again
                        </Typography>
                    )}
                </DialogTitle>
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

                    {!!projects.length && (
                        <Controller
                            name="selectedProjectId"
                            control={control}
                            defaultValue={config?.selectedProjectId || ''}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <FormControl fullWidth margin="dense" error={!!errors.selectedProjectId}>
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
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.handleClose} color="default">
                        Close
                    </Button>
                    <Button type="submit" variant="contained" color="primary" autoFocus>
                        {projects.length ? 'Save' : 'Verify'}
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
