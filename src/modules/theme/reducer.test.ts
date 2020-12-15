import { Theme } from '@keen.io/charts';
import themeReducer, { initialState } from './reducer';
import { ReducerState } from './types';

import {
  setBaseTheme,
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
  const state: ReducerState = {
    base: {},
    dashboards: {
      [dashboardId]: {
        metric: {
          prefix: null,
          suffix: null,
          caption: null,
          excerpt: null,
          value: {
            typography: {
              fontColor: 'blue',
              fontStyle: 'normal',
              fontWeight: 'normal',
              fontSize: 10,
            },
          },
        },
      },
      '@dashboard/02': {
        metric: {
          prefix: null,
          suffix: null,
          caption: null,
          excerpt: null,
          value: {
            typography: {
              fontColor: 'red',
              fontStyle: 'normal',
              fontWeight: 'normal',
              fontSize: 12,
            },
          },
        },
      },
    },
  };

  const action = removeDashboardTheme(dashboardId);
  const { dashboards } = themeReducer(state, action);

  expect(dashboards).toMatchInlineSnapshot(`
    Object {
      "@dashboard/02": Object {
        "metric": Object {
          "caption": null,
          "excerpt": null,
          "prefix": null,
          "suffix": null,
          "value": Object {
            "typography": Object {
              "fontColor": "red",
              "fontSize": 12,
              "fontStyle": "normal",
              "fontWeight": "normal",
            },
          },
        },
      },
    }
  `);
});
