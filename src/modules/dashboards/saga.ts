import {
  takeLatest,
  put,
  select,
  take,
  all,
  getContext,
} from 'redux-saga/effects';
import { push } from 'connected-react-router';
import { Theme } from '@keen.io/charts';

import {
  fetchDashboardListSuccess,
  fetchDashboardListError,
  registerDashboard,
  updateDashboard,
  deregisterDashboard,
  initializeDashboardWidgets as initializeDashboardWidgetsAction,
  createDashboard as createDashboardAction,
  editDashboard as editDashboardAction,
  saveDashboard as saveDashboardAction,
  saveDashboardMeta as saveDashboardMetaAction,
  viewDashboard as viewDashboardAction,
  deleteDashboard as deleteDashboardAction,
  showDeleteConfirmation,
  hideDeleteConfirmation,
} from './actions';

import { serializeDashboard } from './serializers';
import {
  getDashboard,
  getDashboardSettings,
  getDashboardsMetadata,
} from './selectors';
import { getBaseTheme, getActiveDashboardTheme } from '../theme/selectors';

import { setActiveDashboard } from '../app';
import {
  initializeWidget,
  registerWidgets,
  getWidgetSettings,
} from '../widgets';
import { removeDashboardTheme, setDashboardTheme } from '../theme';

import { BLOB_API, NOTIFICATION_MANAGER, ROUTES } from '../../constants';
import {
  INITIALIZE_DASHBOARD_WIDGETS,
  FETCH_DASHBOARDS_LIST,
  CREATE_DASHBOARD,
  SAVE_DASHBOARD,
  SAVE_DASHBOARD_METADATA,
  EDIT_DASHBOARD,
  DELETE_DASHBOARD,
  VIEW_DASHBOARD,
  CONFIRM_DASHBOARD_DELETE,
  HIDE_DELETE_CONFIRMATION,
} from './constants';

import { RootState } from '../../rootReducer';
import { DashboardModel, Dashboard, DashboardMetaData } from './types';

export function* fetchDashboardList() {
  const blobApi = yield getContext(BLOB_API);

  try {
    const responseBody = yield blobApi.getDashboards();

    yield put(fetchDashboardListSuccess(responseBody));
  } catch (err) {
    yield put(fetchDashboardListError());
  }
}

export function* saveDashboardMetadata({
  payload,
}: ReturnType<typeof saveDashboardMetaAction>) {
  const { dashboardId, metadata } = payload;
  try {
    const blobApi = yield getContext(BLOB_API);
    yield blobApi.saveDashboardMeta(dashboardId, metadata);
  } catch (err) {
    console.error(err);
  }
}

export function* saveDashboard({
  payload,
}: ReturnType<typeof saveDashboardAction>) {
  const { dashboardId } = payload;
  const state: RootState = yield select();

  try {
    const dashboard: Dashboard = yield getDashboardSettings(state, dashboardId);
    const dashboardTheme = yield getActiveDashboardTheme(state);
    const serializedDashboard = {
      ...dashboard,
      widgets: dashboard.widgets.map((widgetId) =>
        getWidgetSettings(state, widgetId)
      ),
      baseTheme: dashboardTheme,
    };

    const dashboardsMeta = yield select(getDashboardsMetadata);
    const metadata: DashboardMetaData = dashboardsMeta.find(
      ({ id }) => id === dashboardId
    );

    const updatedMetadata: DashboardMetaData = {
      ...metadata,
      lastModificationDate: +new Date(),
    };

    const blobApi = yield getContext(BLOB_API);
    yield blobApi.saveDashboard(
      dashboardId,
      serializedDashboard,
      updatedMetadata
    );
  } catch (err) {
    console.error(err);
  }
}

export function* createDashboard({
  payload,
}: ReturnType<typeof createDashboardAction>) {
  const { dashboardId } = payload;
  const state: RootState = yield select();

  const baseTheme: Partial<Theme> = yield getBaseTheme(state);
  const serializedDashboard: Dashboard = {
    version: __APP_VERSION__,
    widgets: [],
  };

  yield put(registerDashboard(dashboardId));
  yield put(updateDashboard(dashboardId, serializedDashboard));
  yield put(setDashboardTheme(dashboardId, baseTheme));

  yield put(setActiveDashboard(dashboardId));
  yield put(push(ROUTES.EDITOR));
}

export function* deleteDashboard({
  payload,
}: ReturnType<typeof deleteDashboardAction>) {
  const { dashboardId } = payload;
  yield put(showDeleteConfirmation(dashboardId));
  const notificationManager = yield getContext(NOTIFICATION_MANAGER);

  const action = yield take([
    CONFIRM_DASHBOARD_DELETE,
    HIDE_DELETE_CONFIRMATION,
  ]);

  if (action.type === CONFIRM_DASHBOARD_DELETE) {
    yield put(hideDeleteConfirmation());
    try {
      const blobApi = yield getContext(BLOB_API);
      yield blobApi.deleteDashboard(dashboardId);

      yield put(deregisterDashboard(dashboardId));
      yield put(removeDashboardTheme(dashboardId));
      yield notificationManager.showNotification({
        type: 'info',
        message: 'notifications.dashboard_delete_success',
        autoDismiss: true,
      });
    } catch (err) {
      yield notificationManager.showNotification({
        type: 'error',
        message: 'notifications.dashboard_delete_error',
        showDismissButton: true,
        autoDismiss: false,
      });
    }
  }
}

export function* editDashboard({
  payload,
}: ReturnType<typeof editDashboardAction>) {
  const { dashboardId } = payload;
  const state: RootState = yield select();
  const dashboard = yield getDashboard(state, dashboardId);

  if (!dashboard) {
    yield put(registerDashboard(dashboardId));

    yield put(setActiveDashboard(dashboardId));
    yield put(push(ROUTES.EDITOR));

    const blobApi = yield getContext(BLOB_API);

    try {
      const responseBody: DashboardModel = yield blobApi.getDashboardById(
        dashboardId
      );
      const { baseTheme, ...dashboard } = responseBody;
      const serializedDashboard = serializeDashboard(dashboard);
      const { widgets } = responseBody;

      yield put(registerWidgets(widgets));
      yield put(updateDashboard(dashboardId, serializedDashboard));
      yield put(setDashboardTheme(dashboardId, baseTheme));

      yield put(
        initializeDashboardWidgetsAction(
          dashboardId,
          serializedDashboard.widgets
        )
      );
    } catch (err) {
      console.error(err);
    }
  } else {
    yield put(setActiveDashboard(dashboardId));
    yield put(push(ROUTES.EDITOR));
  }
}

export function* viewDashboard({
  payload,
}: ReturnType<typeof viewDashboardAction>) {
  const { dashboardId } = payload;
  const state: RootState = yield select();
  const dashboard = yield getDashboard(state, dashboardId);

  if (!dashboard) {
    yield put(registerDashboard(dashboardId));
    yield put(setActiveDashboard(dashboardId));
    yield put(push(ROUTES.VIEWER));

    const blobApi = yield getContext(BLOB_API);

    try {
      const responseBody: DashboardModel = yield blobApi.getDashboardById(
        dashboardId
      );

      const { baseTheme, ...dashboard } = responseBody;
      const serializedDashboard = serializeDashboard(dashboard);
      const { widgets } = responseBody;

      yield put(registerWidgets(widgets));
      yield put(updateDashboard(dashboardId, serializedDashboard));
      yield put(setDashboardTheme(dashboardId, baseTheme));

      yield put(
        initializeDashboardWidgetsAction(
          dashboardId,
          serializedDashboard.widgets
        )
      );
    } catch (err) {
      console.error(err);
    }
  } else {
    yield put(setActiveDashboard(dashboardId));
    yield put(push(ROUTES.VIEWER));
  }
}

export function* initializeDashboardWidgets({
  payload,
}: ReturnType<typeof initializeDashboardWidgetsAction>) {
  const { widgetsId } = payload;
  yield all(widgetsId.map((widgetId) => put(initializeWidget(widgetId))));
}

export function* dashboardsSaga() {
  yield takeLatest(FETCH_DASHBOARDS_LIST, fetchDashboardList);
  yield takeLatest(CREATE_DASHBOARD, createDashboard);
  yield takeLatest(SAVE_DASHBOARD, saveDashboard);
  yield takeLatest(SAVE_DASHBOARD_METADATA, saveDashboardMetadata);
  yield takeLatest(DELETE_DASHBOARD, deleteDashboard);
  yield takeLatest(VIEW_DASHBOARD, viewDashboard);
  yield takeLatest(EDIT_DASHBOARD, editDashboard);
  yield takeLatest(INITIALIZE_DASHBOARD_WIDGETS, initializeDashboardWidgets);
}
