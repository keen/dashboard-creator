import { RootState } from '../../rootReducer';

const getActiveDashboard = ({ app }: RootState) => app.activeDashboardId;

const getUser = ({ app }: RootState) => app.user;

const getQueryPicker = ({ app }: RootState) => app.queryPicker;

const getImagePicker = ({ app }: RootState) => app.imagePicker;

const getCachedDashboardsNumber = ({ app }: RootState) =>
  app.cachedDashboardsNumber;

export const appSelectors = {
  getActiveDashboard,
  getUser,
  getQueryPicker,
  getImagePicker,
  getCachedDashboardsNumber,
};
