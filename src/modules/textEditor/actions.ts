import { createAction } from '@reduxjs/toolkit';
import { RawDraftContentState } from 'draft-js';
import { TextAlignment } from './types';

export const applyTextEditorSettings = createAction(
  'APPLY_TEXT_EDITOR_SETTINGS',
  (content: RawDraftContentState, textAlignment: TextAlignment) => ({
    payload: {
      textAlignment,
      content,
    },
  })
);

export const textEditorSagaActions = {
  applyTextEditorSettings,
};
