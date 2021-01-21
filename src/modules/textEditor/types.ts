import { RawDraftContentState } from 'draft-js';

export type ReducerState = {
  isOpen: boolean;
  content: RawDraftContentState;
};
