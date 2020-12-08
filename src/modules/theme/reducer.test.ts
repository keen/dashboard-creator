import deepmerge from 'deepmerge';
import { Theme } from '@keen.io/charts';
import themeReducer, { initialState } from './reducer';
import { ReducerState } from './types';

import {
  setBaseTheme,
  updateBaseTheme,
  setDashboardTheme,
  removeDashboardTheme,
} from './actions';

const theme = {
  metric: {
    value: {
      typography: {
        fontColor: 'red',
        fontSize: 10,
      },
    },
  },
} as Partial<Theme>;

test('set base theme', () => {
  const action = setBaseTheme(theme);
  const { base } = themeReducer(initialState, action);

  expect(base).toMatchInlineSnapshot(`
    Object {
      "metric": Object {
        "value": Object {
          "typography": Object {
            "fontColor": "red",
            "fontSize": 10,
          },
        },
      },
    }
  `);
});

test('update base theme', () => {
  const updatedTheme = {
    metric: {
      value: {
        typography: {
          fontColor: 'blue',
        },
      },
    },
  } as Partial<Theme>;
  const initialState = {
    base: {
      metric: {
        value: {
          typography: {
            fontColor: 'red',
            fontSize: 10,
          },
        },
      },
    },
    dashboards: {},
  } as ReducerState;
  const action = updateBaseTheme(updatedTheme);
  const { base } = themeReducer(initialState, action);

  expect(base).toMatchInlineSnapshot(`
    Object {
      "metric": Object {
        "value": Object {
          "typography": Object {
            "fontColor": "blue",
            "fontSize": 10,
          },
        },
      },
    }
  `);
});

test('set dashboard theme', () => {
  const dashboardId = '@dashboard/01';
  const action = setDashboardTheme(dashboardId, theme);
  const { dashboards } = themeReducer(initialState, action);

  expect(dashboards[dashboardId]).toMatchInlineSnapshot(`
    Object {
      "metric": Object {
        "value": Object {
          "typography": Object {
            "fontColor": "red",
            "fontSize": 10,
          },
        },
      },
    }
  `);
});

test('remove dashboard theme', () => {
  const dashboardId = '@dashboard/01';
  const dashboardsTheme = {
    dashboards: {
      [dashboardId]: {
        metric: {
          value: {
            typography: {
              fontColor: 'blue',
            },
          },
        },
      },
      '@dashboard/02': {
        metric: {
          value: {
            typography: {
              fontColor: 'red',
            },
          },
        },
      },
    },
  };

  const updatedState = deepmerge(initialState, dashboardsTheme);
  const action = removeDashboardTheme(dashboardId);
  const { dashboards } = themeReducer(updatedState, action);

  expect(dashboards).toMatchInlineSnapshot(`
    Object {
      "@dashboard/02": Object {
        "metric": Object {
          "value": Object {
            "typography": Object {
              "fontColor": "red",
            },
          },
        },
      },
    }
  `);
});
