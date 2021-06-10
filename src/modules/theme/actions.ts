import { createAction } from '@reduxjs/toolkit';

const editDashboardTheme = createAction(
  'theme/editDashboardTheme',
  (dashboardId: string) => ({
    payload: {
      dashboardId,
    },
  })
);

const previewTheme = createAction('theme/previewChanges');

const saveDashboardTheme = createAction('theme/saveDashboardTheme');

const cancelEdition = createAction('theme/cancelEdition');

const editorUnmounted = createAction('theme/editorUnmounted');

const loadDashboardFonts = createAction('theme/loadDashboardFonts');

export const themeSagaActions = {
  previewTheme,
  editDashboardTheme,
  saveDashboardTheme,
  editorUnmounted,
  cancelEdition,
  loadDashboardFonts,
};
