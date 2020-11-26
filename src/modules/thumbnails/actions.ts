import { createAction } from '@reduxjs/toolkit';

import { CREATE_DASHBOARD_THUMBNAIL } from './constants';

export const createDashboardThumbnail = createAction(
  CREATE_DASHBOARD_THUMBNAIL,
  (dashboardId: string) => ({
    payload: {
      dashboardId,
    },
  })
);

export type ThumbnailsActions = ReturnType<typeof createDashboardThumbnail>;
