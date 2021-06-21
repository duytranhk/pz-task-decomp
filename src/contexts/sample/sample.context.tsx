import React, { createContext, Dispatch, FC, ReactElement, useReducer } from 'react';
import { SampleModel } from './sample.model';
import { SampleActions, SampleActionTypes, sampleReducer } from './sample.reducer';

export interface SampleState {
    sample: SampleModel;
}

const initialState: SampleState = {
    sample: {},
};

const SampleContext = createContext<ContextWithReducer<SampleState, Dispatch<SampleActions>>>({
    state: initialState,
    dispatch: () => null,
});

const reducer = ({ sample }: SampleState, action: SampleActions) => ({
    sample: sampleReducer(sample, action),
});

const SampleProvider: FC<any> = (props): ReactElement => {
    const [state, dispatch] = useReducer(reducer, initialState);
    return <SampleContext.Provider value={{ state, dispatch }}>{props.children}</SampleContext.Provider>;
};

const useSampleContext = () => React.useContext(SampleContext);

// API call
const sampleActions = {
    getSample: () => (dispatch: Dispatch<SampleActions>) => {
        dispatch({ type: SampleActionTypes.GET_SAMPLE, payload: { value: 'sample data' } });
    },
};
export { SampleProvider, useSampleContext, sampleActions };
