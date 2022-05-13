import { createReducer, on } from '@ngrx/store';
import {isLoading, stopLoading} from './ui.actions';

export interface State {
    isLoading: boolean;
}

export const initialState: State = {
  isLoading: false,
}

export const uiReducer = createReducer(initialState,
			on(isLoading, state => ({ ...state, key: true})),
      on(stopLoading, state => ({ ...state, key: false})),
);
