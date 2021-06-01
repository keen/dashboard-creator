import sagaHelper from 'redux-saga-testing';
import { put, select, take } from 'redux-saga/effects';

import { editDashboardTheme } from './editDashboardTheme';

import { themeSagaActions } from '../actions';
import { themeSelectors } from '../selectors';
import themeSlice from '../reducer';

import { createDashboardSettings, saveDashboard } from '../../dashboards';

describe('Scenario 1: User successfuly updates dashboard theme', () => {
  const dashboardId = '@dashboard/01';
  const action = themeSagaActions.editDashboardTheme(dashboardId);
  const test = sagaHelper(editDashboardTheme(action));

  const baseTheme = {
    colors: ['orange'],
  };

  const themeSettings = {
    theme: {
      colors: ['navyblue'],
    },
    settings: createDashboardSettings(),
  };

  test('get dashboard theme and settings from state', (result) => {
    expect(result).toEqual(
      select(themeSelectors.getThemeByDashboardId, dashboardId)
    );

    return themeSettings;
  });

  test('set intial dashboard theme settings', (result) => {
    expect(result).toEqual(
      put(themeSlice.actions.setInitialDashboardTheme(themeSettings))
    );

    return themeSettings;
  });

  test('get base theme from state', (result) => {
    expect(result).toEqual(select(themeSelectors.getBaseTheme));

    return baseTheme;
  });

  test('set current in edit theme settings', (result) => {
    const { theme, settings } = themeSettings;

    expect(result).toEqual(
      put(
        themeSlice.actions.setCurrentEditTheme({
          theme,
          settings,
        })
      )
    );
  });

  test('shows theme editor modal', (result) => {
    expect(result).toEqual(
      put(
        themeSlice.actions.setModalVisibility({
          isOpen: true,
          inPreviewMode: false,
        })
      )
    );
  });

  test('waits for user action', (result) => {
    expect(result).toEqual(
      take([
        themeSagaActions.saveDashboardTheme.type,
        themeSagaActions.cancelEdition.type,
      ])
    );

    return themeSagaActions.saveDashboardTheme();
  });

  test('get current theme settings from state', (result) => {
    expect(result).toEqual(select(themeSelectors.getCurrentEditTheme));

    return {
      ...themeSettings,
      theme: {
        colors: ['violet'],
      },
    };
  });

  test('set dashboard theme', (result) => {
    const { settings } = themeSettings;

    expect(result).toEqual(
      put(
        themeSlice.actions.setDashboardTheme({
          dashboardId,
          theme: {
            colors: ['violet'],
          },
          settings: settings,
        })
      )
    );
  });

  test('load dashboard fonts', (result) => {
    expect(result).toEqual(put(themeSagaActions.loadDashboardFonts()));
  });

  test('save dashboard', (result) => {
    expect(result).toEqual(put(saveDashboard(dashboardId)));
  });

  test('hides theme editor modal', (result) => {
    expect(result).toEqual(
      put(
        themeSlice.actions.setModalVisibility({
          isOpen: false,
          inPreviewMode: false,
        })
      )
    );
  });

  test('waits until theme editor is unmounted', (result) => {
    expect(result).toEqual(take(themeSagaActions.editorUnmounted.type));

    return themeSagaActions.editorUnmounted();
  });

  test('reset theme editor state', (result) => {
    expect(result).toEqual(put(themeSlice.actions.resetDashboardEdit()));
  });
});

describe('Scenario 2: User cancel dashboard theme edit', () => {
  const dashboardId = '@dashboard/01';
  const action = themeSagaActions.editDashboardTheme(dashboardId);
  const test = sagaHelper(editDashboardTheme(action));

  const baseTheme = {
    colors: ['orange'],
  };

  const themeSettings = {
    theme: {
      colors: ['navyblue'],
    },
    settings: createDashboardSettings(),
  };

  test('get dashboard theme and settings from state', (result) => {
    expect(result).toEqual(
      select(themeSelectors.getThemeByDashboardId, dashboardId)
    );

    return themeSettings;
  });

  test('set intial dashboard theme settings', (result) => {
    expect(result).toEqual(
      put(themeSlice.actions.setInitialDashboardTheme(themeSettings))
    );

    return themeSettings;
  });

  test('get base theme from state', (result) => {
    expect(result).toEqual(select(themeSelectors.getBaseTheme));

    return baseTheme;
  });

  test('set current in edit theme settings', (result) => {
    const { theme, settings } = themeSettings;

    expect(result).toEqual(
      put(
        themeSlice.actions.setCurrentEditTheme({
          theme,
          settings,
        })
      )
    );
  });

  test('shows theme editor modal', (result) => {
    expect(result).toEqual(
      put(
        themeSlice.actions.setModalVisibility({
          isOpen: true,
          inPreviewMode: false,
        })
      )
    );
  });

  test('waits for user action', (result) => {
    expect(result).toEqual(
      take([
        themeSagaActions.saveDashboardTheme.type,
        themeSagaActions.cancelEdition.type,
      ])
    );

    return themeSagaActions.cancelEdition();
  });

  test('set initlal settings as dashboard theme', (result) => {
    const { settings, theme } = themeSettings;

    expect(result).toEqual(
      put(
        themeSlice.actions.setDashboardTheme({
          dashboardId,
          theme,
          settings,
        })
      )
    );
  });

  test('hides theme editor modal', (result) => {
    expect(result).toEqual(
      put(
        themeSlice.actions.setModalVisibility({
          isOpen: false,
          inPreviewMode: false,
        })
      )
    );
  });

  test('waits until theme editor is unmounted', (result) => {
    expect(result).toEqual(take(themeSagaActions.editorUnmounted.type));

    return themeSagaActions.editorUnmounted();
  });

  test('reset theme editor state', (result) => {
    expect(result).toEqual(put(themeSlice.actions.resetDashboardEdit()));
  });
});
