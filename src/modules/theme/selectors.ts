import { RootState } from '../../rootReducer';

export const getBaseTheme = ({ theme }: RootState) => theme.base;

export const getActiveDashboardTheme = (state: RootState) => {
  const {
    app: { activeDashboardId },
    theme: { dashboards },
  } = state;
  return dashboards[activeDashboardId] || {};
};
