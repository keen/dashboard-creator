import { RootState } from '../../rootReducer';

export const getActiveDashboard = ({ app }: RootState) => app.activeDashboardId;

export const getUser = ({ app }: RootState) => app.user;

export const getQueryPicker = ({ app }: RootState) => app.queryPicker;

export const getImagePicker = ({ app }: RootState) => app.imagePicker;
