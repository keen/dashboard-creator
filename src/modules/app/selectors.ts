import { RootState } from '../../rootReducer';

export const getViewMode = ({ app }: RootState) => app.view;

export const getActiveDashboard = ({ app }: RootState) => app.activeDashboardId;
