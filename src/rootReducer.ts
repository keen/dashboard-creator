import { combineReducers } from '@reduxjs/toolkit';

import { appReducer } from './modules/app';
import { dashboardsReducer } from './modules/dashboards';
import { widgetsReducer } from './modules/widgets';

const rootReducer = combineReducers({
  app: appReducer,
  dashboards: dashboardsReducer,
  widgets: widgetsReducer,
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;
