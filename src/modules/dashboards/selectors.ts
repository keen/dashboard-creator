import { RootState } from '../../rootReducer';

export const getDashboardMeta = (
  { dashboards }: RootState,
  dashboardId: string
) => dashboards.metadata.data.find(({ id }) => id === dashboardId);

export const getDashboard = ({ dashboards }: RootState, id: string) =>
  dashboards.items[id];

export const getDashboardsMetadata = ({ dashboards }: RootState) =>
  dashboards.metadata.data;

export const getDashboardsLoadState = ({ dashboards }: RootState) =>
  dashboards.metadata.isInitiallyLoaded;

export const getDashboardSettings = ({ dashboards }: RootState, id: string) =>
  dashboards.items[id].settings;

export const getDeleteConfirmation = ({ dashboards }: RootState) =>
  dashboards.deleteConfirmation;

export const getDashboardSettingsModal = ({ dashboards }: RootState) =>
  dashboards.dashboardSettingsModal;

export const getDashboardShareModal = ({ dashboards }: RootState) =>
  dashboards.dashboardShareModal;

export const getTagsPool = ({ dashboards }: RootState) => dashboards.tagsPool;

export const getDashboardMetaSaving = ({ dashboards }: RootState) =>
  dashboards.metadata.isSavingMetadata;

export const getDashboardListOrder = ({ dashboards }: RootState) =>
  dashboards.dashboardListOrder;

export const getTagsFilter = ({ dashboards }: RootState) =>
  dashboards.tagsFilters;

export const getCurrentDashboardChartsCount = ({
  app,
  widgets,
  dashboards,
}: RootState) => {
  const { activeDashboardId } = app;
  const dashboard = dashboards.items[activeDashboardId];

  if (dashboard) {
    const {
      settings: { widgets: widgetIds },
    } = dashboard;
    return widgetIds
      .map((widgetId) => widgets.items[widgetId])
      .filter(({ widget: { type } }) => type === 'visualization').length;
  }

  return 0;
};

export const getCachedDashboardIds = ({ dashboards }: RootState) =>
  dashboards.cachedDashboardIds;

export const getDashboardAccessKeyRegenerating = ({ dashboards }: RootState) =>
  dashboards.metadata.isRegeneratingAccessKey;
