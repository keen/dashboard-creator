import themeReducer from './reducer';
import {
  setBaseTheme,
  updateBaseTheme,
  setDashboardTheme,
  removeDashboardTheme,
} from './actions';

import { getBaseTheme, getDashboardTheme } from './selectors';
import { SET_BASE_THEME } from './constants';

export {
  themeReducer,
  setBaseTheme,
  updateBaseTheme,
  setDashboardTheme,
  removeDashboardTheme,
  getBaseTheme,
  getDashboardTheme,
  SET_BASE_THEME,
};
