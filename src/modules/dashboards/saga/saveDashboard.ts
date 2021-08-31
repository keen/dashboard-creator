/* eslint-disable @typescript-eslint/no-unused-vars */
import { put, select, getContext } from 'redux-saga/effects';

import {
  saveDashboard as saveDashboardAction,
  updateDashboardMeta,
  saveDashboardSuccess,
  saveDashboardError,
} from '../actions';

import { dashboardsSelectors } from '../selectors';
import { computeDashboardMetadata } from '../utils';

import { themeSelectors } from '../../theme';
import { widgetsSelectors, Widget } from '../../widgets';

import { DASHBOARD_API } from '../../../constants';

import { Dashboard, DashboardModel, DashboardMetaData } from '../types';

import { RootState } from '../../../rootReducer';

/**
 * Flow responsible for saving dashboard model
 * @param dashboardId - dashboard identifer
 *
 * @return void
 *
 */
export function* saveDashboard({
  payload,
}: ReturnType<typeof saveDashboardAction>) {
  const { dashboardId } = payload;
  const state: RootState = yield select();

  try {
    const dashboard: Dashboard = yield select(
      dashboardsSelectors.getDashboardSettings,
      dashboardId
    );

    const { theme, settings } = yield select(
      themeSelectors.getThemeByDashboardId,
      dashboardId
    );

    const serializedDashboard: DashboardModel = {
      ...dashboard,
      widgets: dashboard.widgets
        .map((widgetId) => widgetsSelectors.getWidgetSettings(state, widgetId))
        .reduce((acc, widget: Widget) => {
          if (
            widget.type === 'visualization' &&
            typeof widget.query === 'string'
          ) {
            const { settings, ...savedQueryWidget } = widget;
            return [...acc, savedQueryWidget];
          }
          return [...acc, widget];
        }, []),
      settings,
      theme,
    };

    const dashboardsMeta = yield select(
      dashboardsSelectors.getDashboardsMetadata
    );
    const metadata: DashboardMetaData = dashboardsMeta.find(
      ({ id }) => id === dashboardId
    );

    const updatedMetadata: DashboardMetaData = {
      ...metadata,
      lastModificationDate: +new Date(),
      ...computeDashboardMetadata(serializedDashboard),
    };

    const dashboardApi = yield getContext(DASHBOARD_API);
    yield dashboardApi.saveDashboard(
      dashboardId,
      serializedDashboard,
      updatedMetadata
    );

    yield put(updateDashboardMeta(dashboardId, updatedMetadata));
    yield put(saveDashboardSuccess(dashboardId));
  } catch (err) {
    yield put(saveDashboardError(dashboardId));
  }
}
