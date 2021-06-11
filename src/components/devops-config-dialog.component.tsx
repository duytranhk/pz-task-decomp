import React, { FC, ReactElement, useContext } from 'react';
import { DialogContent, DialogActions, Button, DialogTitle, Dialog, TextField } from '@material-ui/core';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { AzureDevopsConfig, AzureDevopsContext } from '../contexts/azure-devops.context';

const DevopsConfigDialog: FC<DevopsConfigDialogProps> = (props): ReactElement => {
    const { control, handleSubmit } = useForm<AzureDevopsConfig>();
    const { config, setConfig } = useContext(AzureDevopsContext);
    const onSubmit: SubmitHandler<AzureDevopsConfig> = (data: AzureDevopsConfig) => {
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
                        render={({ field }) => <TextField label="Endpoint" margin="normal" type="text" {...field} fullWidth/>}
                    />
                    <Controller
                        name="accessToken"
                        control={control}
                        defaultValue={config?.accessToken || ''}
                        render={({ field }) => <TextField label="Access Token" margin="normal" type="password" {...field} fullWidth />}
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
