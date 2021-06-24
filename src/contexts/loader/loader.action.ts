import { Dispatch } from 'react';
import { LoaderActions, LoaderActionTypes } from './loader.reducer';

export class LoaderAction {
    showLoader = (dispatch: Dispatch<LoaderActions>) => {
        dispatch({ type: LoaderActionTypes.SHOW_LOADER });
    };
    hideLoader = (dispatch: Dispatch<LoaderActions>) => {
        dispatch({ type: LoaderActionTypes.HIDE_LOADER });
    };
}
