import React, { FC, ReactElement, useContext } from 'react';
import { DialogContent, DialogActions, Button, DialogTitle, Dialog, TextField, Link } from '@material-ui/core';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { AzureDevopsConfig, AzureDevopsContext } from '../contexts/azure-devops.context';

const DevopsConfigDialog: FC<DevopsConfigDialogProps> = (props): ReactElement => {
    const { control, handleSubmit } = useForm<AzureDevopsConfig>();
    const { config, setConfig } = useContext(AzureDevopsContext);
    const onSubmit: SubmitHandler<AzureDevopsConfig> = async (data: AzureDevopsConfig) => {
        setConfig(data);
        props.handleClose();
    };
    return (
        <Dialog open={props.open} onClose={props.handleClose}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogTitle>Azure Devops Configuration</DialogTitle>
                <DialogContent>
                    <Controller
                        name="endpoint"
                        control={control}
                        defaultValue={config?.endpoint || ''}
                        render={({ field }) => (
                            <TextField
                                label="Organisation Url"
                                margin="normal"
                                type="text"
                                {...field}
                                placeholder="https://dev.azure.com/{your-project-name}"
                                fullWidth
                            />
                        )}
                    />
                    <Controller
                        name="accessToken"
                        control={control}
                        defaultValue={config?.accessToken || ''}
                        render={({ field }) => (
                            <TextField
                                label="Personal access token"
                                margin="normal"
                                type="password"
                                {...field}
                                fullWidth
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
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.handleClose} color="default">
                        Cancel
                    </Button>
                    <Button type="submit" variant="contained" color="primary" autoFocus>
                        Save
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
