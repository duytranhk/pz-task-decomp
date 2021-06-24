import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import React, { Dispatch, FC, ReactElement, useContext, useReducer } from 'react';
import { LoaderAction } from './loader.action';
import { LoaderActions, loaderReducer, LoaderState } from './loader.reducer';

const initialState: LoaderState = {
    isLoading: false,
};

const LoaderContext = React.createContext<ContextWithReducer<LoaderState, Dispatch<LoaderActions>>>({
    state: initialState,
    dispatch: () => null,
});

const reducer = (state: LoaderState, action: LoaderActions) => loaderReducer(state, action);

const useStyles = makeStyles({
    root: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.7)',
        zIndex: 10001,
    },
});
const LoaderProvider: FC<any> = (props): ReactElement => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const classes = useStyles();
    return (
        <LoaderContext.Provider value={{ state, dispatch }}>
            {state.isLoading && (
                <div className={classes.root}>
                    <CircularProgress size={68} />
                </div>
            )}
            {props.children}
        </LoaderContext.Provider>
    );
};

const useLoaderContext = () => useContext(LoaderContext);
const loaderActions = new LoaderAction();
export { LoaderProvider, useLoaderContext, loaderActions };
