/* eslint-disable @typescript-eslint/naming-convention */
import { put, select, getContext } from 'redux-saga/effects';
import { push } from 'connected-react-router';
import { v4 as uuid } from 'uuid';

import {
  updateDashboard,
  initializeDashboardWidgets,
  cloneDashboard as cloneDashboardAction,
  addClonedDashboard,
} from '../actions';

import { appActions, appSelectors } from '../../app';
import { registerWidgets } from '../../widgets';
import { themeActions, themeSelectors } from '../../theme';

import { serializeDashboard } from '../serializers';
import { createDashboardSettings, createWidgetsUniqueIds } from '../utils';

import {
  DASHBOARD_API,
  NOTIFICATION_MANAGER,
  ROUTES,
} from '../../../constants';

import { DashboardModel } from '../types';

/**
 * Flow responsible for cloning dashboard model instance
 * @param dashboardId - dashboard identifer
 *
 * @return void
 *
 */
export function* cloneDashboard({
  payload,
}: ReturnType<typeof cloneDashboardAction>) {
  const { dashboardId } = payload;

  const notificationManager = yield getContext(NOTIFICATION_MANAGER);
  try {
    const dashboardApi = yield getContext(DASHBOARD_API);

    const model: DashboardModel = yield dashboardApi.getDashboardById(
      dashboardId
    );
    const { theme, settings } = model;

    const uniqueIdWidgets = createWidgetsUniqueIds(model.widgets);

    const newDashboardId = uuid();
    const metaData = yield dashboardApi.getDashboardMetaDataById(dashboardId);
    const newMetaData = {
      ...metaData,
      id: newDashboardId,
      title: metaData.title ? `${metaData.title} Clone` : 'Clone',
      isPublic: false,
      lastModificationDate: +new Date(),
    };

    const newModel = {
      ...model,
      widgets: uniqueIdWidgets,
    };

    yield dashboardApi.saveDashboard(newDashboardId, newModel, newMetaData);

    yield put(addClonedDashboard(newMetaData));

    let dashboardTheme = theme;
    if (!dashboardTheme) {
      dashboardTheme = yield select(themeSelectors.getBaseTheme);
    }
    const dashboardSettings = settings || createDashboardSettings();

    yield put(
      themeActions.setDashboardTheme({
        dashboardId: newDashboardId,
        theme: dashboardTheme,
        settings: dashboardSettings,
      })
    );

    yield notificationManager.showNotification({
      type: 'info',
      message: 'notifications.dashboard_cloned',
      autoDismiss: true,
    });

    const activeDashboard = yield select(appSelectors.getActiveDashboard);

    if (activeDashboard) {
      const serializedDashboard = serializeDashboard(newModel);
      yield put(registerWidgets(uniqueIdWidgets));
      yield put(updateDashboard(newDashboardId, serializedDashboard));
      yield put(
        initializeDashboardWidgets(newDashboardId, serializedDashboard.widgets)
      );

      yield put(appActions.setActiveDashboard(newDashboardId));
      yield put(push(ROUTES.EDITOR));
    }
  } catch (err) {
    yield notificationManager.showNotification({
      type: 'error',
      message: 'notifications.dashboard_cloned_error',
      showDismissButton: true,
      autoDismiss: false,
    });
  }
}
