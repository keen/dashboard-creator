import { RootState } from '../../rootReducer';

const getBaseTheme = ({ theme }: RootState) => theme.defaultTheme;

const getThemeModal = ({ theme }: RootState) => theme.modal;

const getEditorSection = ({ theme }: RootState) => theme.editorSection;

const getThemeByDashboardId = (state: RootState, dashboardId: string) => {
  const {
    theme: { dashboards },
  } = state;
  return dashboards[dashboardId];
};

const getCurrentEditTheme = (state: RootState) => state.theme.currentEditTheme;

const getActiveDashboardTheme = (state: RootState) => {
  const {
    app: { activeDashboardId },
    theme: { dashboards },
  } = state;
  return dashboards[activeDashboardId]?.theme || {};
};

export const themeSelectors = {
  getBaseTheme,
  getThemeModal,
  getEditorSection,
  getCurrentEditTheme,
  getThemeByDashboardId,
  getActiveDashboardTheme,
};
