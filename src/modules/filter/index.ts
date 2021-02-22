import filterReducer, { initialState } from './reducer';
import { filterSaga } from './saga';
import {
  openEditor,
  closeEditor,
  resetEditor,
  applySettings,
  updateConnection,
  setEventStream,
  setTargetProperty,
  setEditorConnections,
  setEditorDetachedConnections,
  setupDashboardEventStreams,
} from './actions';
import { ReducerState, SchemaPropertiesList } from './types';

import {
  getFilterWidgetConnections,
  getDetachedFilterWidgetConnections,
} from './saga';
import {
  SET_EVENT_STREAM,
  APPLY_EDITOR_SETTINGS,
  CLOSE_EDITOR,
} from './constants';
import { getFilterSettings } from './selectors';

export {
  getFilterSettings,
  filterReducer,
  initialState,
  applySettings,
  setupDashboardEventStreams,
  setEventStream,
  setTargetProperty,
  setEditorConnections,
  setEditorDetachedConnections,
  updateConnection,
  openEditor,
  resetEditor,
  closeEditor,
  filterSaga,
  getFilterWidgetConnections,
  getDetachedFilterWidgetConnections,
  SET_EVENT_STREAM,
  APPLY_EDITOR_SETTINGS,
  CLOSE_EDITOR,
  ReducerState,
  SchemaPropertiesList,
};
