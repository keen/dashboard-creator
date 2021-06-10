import sagaHelper from 'redux-saga-testing';
import { select } from 'redux-saga/effects';
import { FontLoader } from '@keen.io/ui-core';

import { loadDashboardFonts } from './loadDashboardFonts';

import { themeSelectors } from '../selectors';

jest.mock('@keen.io/ui-core', () => {
  return {
    FontLoader: {
      loadFont: jest.fn().mockImplementation((fonts) => fonts),
    },
  };
});

const chartTitlesFont = 'chartTitlesFont';
const visualizationsFont = 'visualizationsFont';

describe('Scenario 1: User successfuly loads dashboard fonts', () => {
  const test = sagaHelper(loadDashboardFonts());

  test('get active dashboard theme settings from state', (result) => {
    expect(result).toEqual(
      select(themeSelectors.getActiveDashboardThemeSettings)
    );

    return {
      settings: {
        page: {
          chartTitlesFont,
          visualizationsFont,
        },
      },
    };
  });

  test('Font loader should have been called', () => {
    expect(FontLoader.loadFont).toHaveBeenCalledWith([
      chartTitlesFont,
      visualizationsFont,
    ]);
  });
});
