import { Theme } from '@keen.io/charts';

import themeSlice, { initialState } from './reducer';
import { ReducerState } from './types';

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
  const action = themeSlice.actions.setBaseTheme(theme);
  const { base } = themeSlice.reducer(initialState, action);

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
  const action = themeSlice.actions.setDashboardTheme({ dashboardId, theme });
  const { dashboards } = themeSlice.reducer(initialState, action);

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

  const action = themeSlice.actions.removeDashboardTheme({ dashboardId });
  const { dashboards } = themeSlice.reducer(state, action);

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
