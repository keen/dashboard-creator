import { createAction } from '@reduxjs/toolkit';
import { RawDraftContentState } from 'draft-js';

import { TextAlignment } from './types';

import {
  OPEN_EDITOR,
  CLOSE_EDITOR,
  SET_EDITOR_CONTENT,
  SET_TEXT_ALIGNMENT,
  APPLY_TEXT_EDITOR_SETTINGS,
} from './constants';

export const openEditor = createAction(OPEN_EDITOR);

export const closeEditor = createAction(CLOSE_EDITOR);

export const setEditorContent = createAction(
  SET_EDITOR_CONTENT,
  (content: RawDraftContentState) => ({
    payload: {
      content,
    },
  })
);

export const setTextAlignment = createAction(
  SET_TEXT_ALIGNMENT,
  (textAlignment: TextAlignment) => ({
    payload: {
      textAlignment,
    },
  })
);

export const applyTextEditorSettings = createAction(
  APPLY_TEXT_EDITOR_SETTINGS,
  (content: RawDraftContentState, textAlignment: TextAlignment) => ({
    payload: {
      textAlignment,
      content,
    },
  })
);

export type TextEditorActions =
  | ReturnType<typeof applyTextEditorSettings>
  | ReturnType<typeof setEditorContent>
  | ReturnType<typeof setTextAlignment>
  | ReturnType<typeof openEditor>
  | ReturnType<typeof closeEditor>;
