import { combineReducers } from '@reduxjs/toolkit';
import { connectRouter } from 'connected-react-router';
import { createMemoryHistory } from 'history';

import { appReducer } from './modules/app';
import { dashboardsReducer } from './modules/dashboards';
import { widgetsReducer } from './modules/widgets';
import { queriesReducer } from './modules/queries';
import { datePickerReducer } from './modules/datePicker';
import { themeReducer } from './modules/theme';
import { chartEditorReducer } from './modules/chartEditor';
import { textEditorReducer } from './modules/textEditor';

export const history = createMemoryHistory();

const rootReducer = combineReducers({
  app: appReducer,
  dashboards: dashboardsReducer,
  widgets: widgetsReducer,
  queries: queriesReducer,
  datePicker: datePickerReducer,
  chartEditor: chartEditorReducer,
  textEditor: textEditorReducer,
  router: connectRouter(history),
  theme: themeReducer,
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;
