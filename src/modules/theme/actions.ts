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

export const themeSagaActions = {
  previewTheme,
  editDashboardTheme,
  saveDashboardTheme,
  cancelEdition,
};
