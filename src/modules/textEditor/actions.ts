import { createAction } from '@reduxjs/toolkit';
import { RawDraftContentState } from 'draft-js';

import {
  OPEN_EDITOR,
  CLOSE_EDITOR,
  SET_EDITOR_CONTENT,
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

export const applyTextEditorSettings = createAction(
  APPLY_TEXT_EDITOR_SETTINGS,
  (content: RawDraftContentState) => ({
    payload: {
      content,
    },
  })
);

export type TextEditorActions =
  | ReturnType<typeof applyTextEditorSettings>
  | ReturnType<typeof setEditorContent>
  | ReturnType<typeof openEditor>
  | ReturnType<typeof closeEditor>;
