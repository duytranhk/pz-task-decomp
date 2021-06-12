import React, { FC, ReactElement, useContext } from 'react';
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
} from '@material-ui/core';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { AzureDevopsConfig, AzureDevopsContext } from '../contexts/azure-devops.context';

const DevopsConfigDialog: FC<DevopsConfigDialogProps> = (props): ReactElement => {
    const { control, handleSubmit } = useForm<AzureDevopsConfig>();
    const { config, projects, setConfig } = useContext(AzureDevopsContext);
    const onSubmit: SubmitHandler<AzureDevopsConfig> = async (data: AzureDevopsConfig) => {
        setConfig(data);
        if (data.selectedProjectId) {
            props.handleClose();
        }
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
                    {projects?.length && (
                        <Controller
                            name="selectedProjectId"
                            control={control}
                            defaultValue={config?.selectedProjectId || ''}
                            render={({ field }) => (
                                <FormControl fullWidth margin="normal">
                                    <InputLabel id="select-project">Select Project</InputLabel>
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
