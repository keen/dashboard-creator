import themeReducer from './reducer';
import {
  setBaseTheme,
  setDashboardTheme,
  removeDashboardTheme,
} from './actions';

import { getBaseTheme, getActiveDashboardTheme } from './selectors';
import { SET_BASE_THEME } from './constants';

export {
  themeReducer,
  setBaseTheme,
  setDashboardTheme,
  removeDashboardTheme,
  getBaseTheme,
  getActiveDashboardTheme,
  SET_BASE_THEME,
};
