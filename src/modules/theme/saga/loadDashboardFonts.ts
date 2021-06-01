import { select } from 'redux-saga/effects';
import { FontLoader } from '@keen.io/ui-core';

import { themeSelectors } from '../selectors';

/**
 * Flow responsible for loading fonts to the dashboard
 *
 * @return void
 *
 */
export function* loadDashboardFonts() {
  const {
    settings: {
      page: { chartTitlesFont, visualizationsFont },
    },
  } = yield select(themeSelectors.getActiveDashboardThemeSettings);
  console.log('saga loading fonts');
  FontLoader.loadFont([chartTitlesFont, visualizationsFont]);
}
