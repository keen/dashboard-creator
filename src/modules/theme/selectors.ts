import { RootState } from '../../rootReducer';

export const getBaseTheme = ({ theme }: RootState) => theme.base;

export const getDashboardTheme = ({ theme }: RootState, id: string) =>
  theme.dashboards[id] || {};
