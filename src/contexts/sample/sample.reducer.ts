import { SampleModel } from './sample.model';

export enum SampleActionTypes {
    GET_SAMPLE = 'GET_SAMPLE',
}

interface SamplePayload {
    [SampleActionTypes.GET_SAMPLE]: SampleModel;
}

export type SampleActions = ActionMap<SamplePayload>[keyof ActionMap<SamplePayload>];

export const sampleReducer = (state: SampleModel, action: SampleActions) => {
    switch (action.type) {
        case SampleActionTypes.GET_SAMPLE:
            return {
                ...state,
                ...action.payload,
            };
        default:
            return state;
    }
};
