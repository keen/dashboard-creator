import themeReducer from './reducer';
import {
  setBaseTheme,
  setDashboardTheme,
  removeDashboardTheme,
} from './actions';

import { getBaseTheme, getDashboardTheme } from './selectors';
import { SET_BASE_THEME } from './constants';

export {
  themeReducer,
  setBaseTheme,
  setDashboardTheme,
  removeDashboardTheme,
  getBaseTheme,
  getDashboardTheme,
  SET_BASE_THEME,
};
