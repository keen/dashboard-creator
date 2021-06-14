import { CombinedState, StateFromReducersMapObject } from '@reduxjs/toolkit';

import { appReducer } from './modules/app';
import { dashboardsReducer } from './modules/dashboards';
import { widgetsReducer } from './modules/widgets';
import { queriesReducer } from './modules/queries';
import { datePickerReducer } from './modules/datePicker';
import { themeReducer } from './modules/theme';
import { chartEditorReducer } from './modules/chartEditor';
import { textEditorReducer } from './modules/textEditor';
import { filterReducer } from './modules/filter';
import { timezoneReducer } from './modules/timezone';

const rootReducer = {
  app: appReducer,
  dashboards: dashboardsReducer,
  widgets: widgetsReducer,
  queries: queriesReducer,
  datePicker: datePickerReducer,
  filter: filterReducer,
  chartEditor: chartEditorReducer,
  textEditor: textEditorReducer,
  theme: themeReducer,
  timezone: timezoneReducer,
};

export default rootReducer;
export type RootState = CombinedState<
  StateFromReducersMapObject<typeof rootReducer>
>;
