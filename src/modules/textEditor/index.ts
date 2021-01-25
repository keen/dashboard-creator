import textEditorReducer from './reducer';
import {
  openEditor,
  closeEditor,
  setTextAlignment,
  setEditorContent,
  applyTextEditorSettings,
} from './actions';
import { getTextEditor } from './selectors';
import { CLOSE_EDITOR, APPLY_TEXT_EDITOR_SETTINGS } from './constants';
import { TextAlignment } from './types';

export {
  openEditor,
  closeEditor,
  setTextAlignment,
  setEditorContent,
  applyTextEditorSettings,
  textEditorReducer,
  getTextEditor,
  TextAlignment,
  CLOSE_EDITOR,
  APPLY_TEXT_EDITOR_SETTINGS,
};
