import React, { ReactElement, FC } from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

const theme = createMuiTheme({
    palette: {
        primary: {
            dark: '#0097A7',
            main: '#00BCD4',
            light: '#B2EBF2',
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: '#607D8B',
        },
        text: {
            primary: '#212121',
            secondary: '#757575',
        },
        divider: '#BDBDBD',
    },
    overrides: {
        MuiButton: {
            root: {
                borderRadius: 16,
            },
            contained: {
                boxShadow: 'none',
            },
        },
        MuiAppBar: {
            colorPrimary: {
                background: 'linear-gradient(123deg, #0097a7 0%, #4cc5cf 100%)',
            },
        },
        MuiPaper: {
            rounded: {
                borderRadius: 16,
            },
            elevation1: {
                boxShadow: '0 3px 14px 0 rgba(213, 227, 239, 0.6)',
            },
            elevation4: {
                boxShadow: '0 3px 14px 0 rgba(213, 227, 239, 0.6)',
            },
            elevation24: {
                boxShadow: '0 3px 14px 0 rgba(213, 227, 239, 0.6)',
            },
        },
        MuiBackdrop: {
            root: {
                backgroundColor: 'rgba(244, 247, 250, 0.5)',
            },
        },
    },
});
const AppTheme: FC = (props): ReactElement => {
    return <ThemeProvider theme={theme}>{props.children}</ThemeProvider>;
};

export default AppTheme;
