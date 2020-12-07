import { RootState } from '../../rootReducer';

export const getBaseTheme = ({ theme }: RootState) => theme.base;

export const getDashboardTheme = ({ theme }: RootState, id: string) => {
  const dashboardTheme = theme.dashboards[id];
  if (dashboardTheme) return dashboardTheme[id];
  return {};
};
