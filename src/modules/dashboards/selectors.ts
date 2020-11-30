import { RootState } from '../../rootReducer';

export const getDashboardsList = ({ dashboards }: RootState) =>
  dashboards.metadata.data;

export const getDashboard = ({ dashboards }: RootState, id: string) =>
  dashboards.items[id];

export const getDashboardsMetadata = ({ dashboards }: RootState) =>
  dashboards.metadata.data;

export const getDashboardsLoadState = ({ dashboards }: RootState) =>
  dashboards.metadata.isInitiallyLoaded;

export const getDashboardSettings = ({ dashboards }: RootState, id: string) =>
  dashboards.items[id].settings;
