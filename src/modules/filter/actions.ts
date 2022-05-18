import { createAction } from '@reduxjs/toolkit';

export const applySettings = createAction('@filter/APPLY_SETTINGS');

export const setupDashboardEventStreams = createAction(
  '@filter/SETUP_DASHBOARD_EVENT_STREAMS',
  (dashboardId: string) => ({
    payload: {
      dashboardId,
    },
  })
);
