import React, { ReactElement, FC } from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#0097a7',
        },
        secondary: {
            main: '#00838f',
        },
        text: {
            primary: '#4a4a4a',
        },
    },
    overrides: {
        MuiButton: {
            root: {
                borderRadius: 16,
            },
        },
        MuiPaper: {
            rounded: {
                borderRadius: 16,
            },
            elevation24: {
                boxShadow: '0 3px 14px 0 rgb(213 227 239 / 60%)',
            },
        },
        MuiBackdrop: {
            root: {
                backgroundColor: 'rgba(244, 247, 250, 0.3)',
            },
        },
    },
});
const AppTheme: FC = (props): ReactElement => {
    return <ThemeProvider theme={theme}>{props.children}</ThemeProvider>;
};

export default AppTheme;
