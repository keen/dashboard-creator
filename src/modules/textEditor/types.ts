import { RawDraftContentState } from 'draft-js';

export type ReducerState = {
  isOpen: boolean;
  textAlignment: TextAlignment;
  content: RawDraftContentState;
};

export type TextAlignment = 'left' | 'center' | 'right';
