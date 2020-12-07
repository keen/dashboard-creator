import themeReducer from './reducer';
import {
  setBaseTheme,
  updateBaseTheme,
  resetBaseTheme,
  updateDashboardTheme,
  removeDashboardTheme,
} from './actions';

import { getBaseTheme, getDashboardTheme } from './selectors';
import { SET_BASE_THEME } from './constants';

export {
  themeReducer,
  setBaseTheme,
  updateBaseTheme,
  resetBaseTheme,
  updateDashboardTheme,
  removeDashboardTheme,
  getBaseTheme,
  getDashboardTheme,
  SET_BASE_THEME,
};
