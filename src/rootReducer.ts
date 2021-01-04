import { combineReducers } from '@reduxjs/toolkit';
import { connectRouter } from 'connected-react-router';
import { createMemoryHistory } from 'history';

import { appReducer } from './modules/app';
import { dashboardsReducer } from './modules/dashboards';
import { widgetsReducer } from './modules/widgets';
import { themeReducer } from './modules/theme';
import { chartEditorReducer } from './modules/chartEditor';

export const history = createMemoryHistory();

const rootReducer = combineReducers({
  app: appReducer,
  dashboards: dashboardsReducer,
  widgets: widgetsReducer,
  chartEditor: chartEditorReducer,
  router: connectRouter(history),
  theme: themeReducer,
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;
