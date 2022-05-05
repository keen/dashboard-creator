import { Theme } from '@keen.io/charts';

import themeSlice, { initialState } from './reducer';
import { ReducerState } from './types';
import { createDashboardSettings } from '../dashboards/utils';

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

test('set modal visibility state', () => {
  const action = themeSlice.actions.setModalVisibility({
    isOpen: true,
    inPreviewMode: true,
  });

  const { modal } = themeSlice.reducer(initialState, action);

  expect(modal).toEqual({
    isOpen: true,
    inPreviewMode: true,
  });
});

test('set base theme', () => {
  const action = themeSlice.actions.setBaseTheme(theme);
  const { defaultTheme } = themeSlice.reducer(initialState, action);

  expect(defaultTheme).toMatchInlineSnapshot(`
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

test('reset dashboard edit state', () => {
  const action = themeSlice.actions.resetDashboardEdit();
  const { initialTheme, currentEditTheme } = themeSlice.reducer(
    {
      ...initialState,
      initialTheme: {
        theme: { colors: ['navyblue'] },
        settings: createDashboardSettings(),
      },
      currentEditTheme: {
        theme: { colors: ['orange'] },
        settings: createDashboardSettings(),
      },
    },
    action
  );

  expect(initialTheme).toEqual({});
  expect(currentEditTheme).toEqual({});
});

test('set initial theme settings', () => {
  const dashboardSettings = createDashboardSettings();

  const action = themeSlice.actions.setInitialDashboardTheme({
    theme,
    settings: dashboardSettings,
  });
  const { initialTheme } = themeSlice.reducer(initialState, action);

  expect(initialTheme).toEqual({
    theme,
    settings: dashboardSettings,
  });
});

test('set chages for current theme in edit', () => {
  const dashboardSettings = createDashboardSettings();

  const action = themeSlice.actions.setCurrentEditTheme({
    theme,
    settings: dashboardSettings,
  });
  const { currentEditTheme } = themeSlice.reducer(initialState, action);

  expect(currentEditTheme).toEqual({
    theme,
    settings: dashboardSettings,
  });
});

test('set dashboard theme', () => {
  const dashboardId = '@dashboard/01';
  const dashboardSettings = createDashboardSettings();

  const action = themeSlice.actions.setDashboardTheme({
    dashboardId,
    theme,
    settings: dashboardSettings,
  });
  const { dashboards } = themeSlice.reducer(initialState, action);

  expect(dashboards[dashboardId]).toEqual({
    theme,
    settings: dashboardSettings,
  });
});

test('remove dashboard theme', () => {
  const dashboardId = '@dashboard/01';
  const state: ReducerState = {
    ...initialState,
    defaultTheme: {},
    dashboards: {
      [dashboardId]: {
        theme,
        settings: createDashboardSettings(),
      },
      '@dashboard/02': {
        theme,
        settings: createDashboardSettings(),
      },
    },
  };

  const action = themeSlice.actions.removeDashboardTheme({ dashboardId });
  const { dashboards } = themeSlice.reducer(state, action);

  expect(dashboards).toEqual({
    ['@dashboard/02']: {
      theme,
      settings: createDashboardSettings(),
    },
  });
});
