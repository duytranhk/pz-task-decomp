export enum LoaderActionTypes {
    SHOW_LOADER = 'SHOW_LOADER',
    HIDE_LOADER = 'HIDE_LOADER',
}

interface LoaderPayload {
    [LoaderActionTypes.SHOW_LOADER]: undefined;
    [LoaderActionTypes.HIDE_LOADER]: undefined;
}

export interface LoaderState {
    isLoading: boolean;
}

export type LoaderActions = ActionMap<LoaderPayload>[keyof ActionMap<LoaderPayload>];

export const loaderReducer = (state: LoaderState, action: LoaderActions) => {
    switch (action.type) {
        case LoaderActionTypes.SHOW_LOADER:
            return { isLoading: true };
        case LoaderActionTypes.HIDE_LOADER:
            return { isLoading: false };
        default:
            return state;
    }
};
