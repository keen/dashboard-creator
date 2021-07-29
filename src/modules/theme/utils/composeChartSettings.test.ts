import { Theme } from '@keen.io/charts';

import { ChartSettings } from '../../../types';
import { composeChartSettings } from './composeChartSettings';

describe('should compose chart settings with theme', () => {
  const baseTheme = {
    gridX: {
      color: 'red',
      enabled: true,
    },
    gridY: {
      enabled: false,
    },
  } as Theme;

  test('Scenario 1: adds theme field to chart settings if theme field is missing', () => {
    const chartSettingsWithoutTheme = {
      curve: 'linear',
      stackMode: 'normal',
      groupMode: 'grouped',
    };
    const composedChartSettings = composeChartSettings(
      chartSettingsWithoutTheme,
      baseTheme
    );
    expect(composedChartSettings).toStrictEqual({
      curve: 'linear',
      stackMode: 'normal',
      groupMode: 'grouped',
      theme: {
        gridX: {
          color: 'red',
          enabled: true,
        },
        gridY: {
          enabled: false,
        },
      },
    });
  });

  test('Scenario 2: merges base theme settings with chart settings if theme field exists in chart', () => {
    const chartSettingsWithTheme = {
      curve: 'linear',
      stackMode: 'normal',
      groupMode: 'grouped',
      theme: {
        gridX: {
          color: 'blue',
          enabled: false,
        },
      },
    } as ChartSettings;
    const composedChartSettings = composeChartSettings(
      chartSettingsWithTheme,
      baseTheme
    );
    expect(composedChartSettings).toStrictEqual({
      curve: 'linear',
      stackMode: 'normal',
      groupMode: 'grouped',
      theme: {
        gridX: {
          color: 'blue',
          enabled: false,
        },
        gridY: {
          enabled: false,
        },
      },
    });
  });
});
