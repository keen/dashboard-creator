import {
  openEditor,
  closeEditor,
  applySettings,
  updateConnection,
  setEditorConnections,
  setName,
} from './actions';

import datePickerReducer from './reducer';
import { getDatePickerSettings } from './selectors';
import { datePickerSaga } from './saga';

import { APPLY_EDITOR_SETTINGS, CLOSE_EDITOR } from './constants';

import { DatePickerConnection, ReducerState } from './types';

const datePickerActions = {
  openEditor,
  closeEditor,
  applySettings,
  updateConnection,
  setEditorConnections,
  setName,
};

export {
  getDatePickerSettings,
  datePickerReducer,
  openEditor,
  closeEditor,
  applySettings,
  updateConnection,
  setEditorConnections,
  datePickerSaga,
  APPLY_EDITOR_SETTINGS,
  CLOSE_EDITOR,
  ReducerState,
  DatePickerConnection,
  datePickerActions,
};
