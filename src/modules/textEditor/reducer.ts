import { ReducerState, TextAlignment } from './types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RawDraftContentState } from 'draft-js';

export const initialState: ReducerState = {
  isOpen: false,
  textAlignment: 'left',
  content: {
    blocks: [],
    entityMap: {},
  },
};

export const textEditorSlice = createSlice({
  name: 'textEditor',
  initialState,
  reducers: {
    setTextAlignment: (state, { payload }: PayloadAction<TextAlignment>) => {
      state.textAlignment = payload;
    },
    setEditorContent: (
      state,
      { payload }: PayloadAction<RawDraftContentState>
    ) => {
      state.content = payload;
    },
    openEditor: (state) => {
      state.isOpen = true;
    },
    closeEditor: (state) => {
      state.content = initialState.content;
      state.textAlignment = initialState.textAlignment;
      state.isOpen = false;
    },
  },
});

export default textEditorSlice;
