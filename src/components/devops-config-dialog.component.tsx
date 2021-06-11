import React, { FC, ReactElement, useContext } from 'react';
import { DialogContent, DialogActions, Button, DialogTitle, Dialog, TextField } from '@material-ui/core';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { AzureDevopsContext } from '../contexts/azure-devops.context';

interface IDevopsConfigForm {
    endpoint?: string;
    accessToken?: string;
}
const DevopsConfigDialog: FC<DevopsConfigDialogProps> = (props): ReactElement => {
    const { control, handleSubmit } = useForm<IDevopsConfigForm>();
    const azureDevopsContext = useContext(AzureDevopsContext);
    const onSubmit: SubmitHandler<IDevopsConfigForm> = (data: IDevopsConfigForm) => {
        azureDevopsContext.endpoint = data.endpoint;
        azureDevopsContext.accessToken = data.accessToken;
    };
    return (
        <Dialog
            open={props.open}
            onClose={props.handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogTitle id="alert-dialog-title">Azure Devops Configuration</DialogTitle>
                <DialogContent>
                    <Controller
                        name="endpoint"
                        control={control}
                        defaultValue=""
                        render={({ field }) => <TextField label="Endpoint" margin="normal" type="text" {...field} fullWidth />}
                    />
                    <Controller
                        name="accessToken"
                        control={control}
                        defaultValue=""
                        render={({ field }) => <TextField label="Access Token" margin="normal" type="password" {...field} fullWidth />}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.handleClose} color="default">
                        Cancel
                    </Button>
                    <Button type="submit" color="primary" autoFocus>
                        Set
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
