import widgetsReducer from './reducer';
import { registerWidgets, updateWidgetsPosition } from './actions';
import { getWidgetsPosition, getWidgetSettings } from './selectors';
import { Widget, WidgetsPosition } from './types';

export {
  Widget,
  WidgetsPosition,
  widgetsReducer,
  registerWidgets,
  updateWidgetsPosition,
  getWidgetSettings,
  getWidgetsPosition,
};
