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
  setName,
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

const filterActions = {
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
  setName,
};

export {
  getFilterSettings,
  filterReducer,
  initialState,
  applySettings,
  setupDashboardEventStreams,
  setEventStream,
  setTargetProperty,
  setName,
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
  filterActions,
};

export type { ReducerState, SchemaPropertiesList };
