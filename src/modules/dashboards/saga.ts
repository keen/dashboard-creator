import { takeLatest, put, select, all, getContext } from 'redux-saga/effects';
import { push } from 'connected-react-router';

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
  viewDashboard as viewDashboardAction,
  deleteDashboard as deleteDashboardAction,
} from './actions';

import { serializeDashboard } from './serializers';
import {
  getDashboard,
  getDashboardSettings,
  getDashboardsMetadata,
} from './selectors';

import { setActiveDashboard } from '../app';
import {
  initializeWidget,
  registerWidgets,
  getWidgetSettings,
} from '../widgets';

import { BLOB_API, ROUTES } from '../../constants';
import {
  INITIALIZE_DASHBOARD_WIDGETS,
  FETCH_DASHBOARDS_LIST,
  CREATE_DASHBOARD,
  SAVE_DASHBOARD,
  EDIT_DASHBOARD,
  DELETE_DASHBOARD,
  VIEW_DASHBOARD,
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

export function* saveDashboard({
  payload,
}: ReturnType<typeof saveDashboardAction>) {
  const { dashboardId } = payload;
  const state: RootState = yield select();

  try {
    const dashboard: Dashboard = yield getDashboardSettings(state, dashboardId);
    const serializedDashboard = {
      ...dashboard,
      widgets: dashboard.widgets.map((widgetId) =>
        getWidgetSettings(state, widgetId)
      ),
    };

    const dashboardsMeta = yield select(getDashboardsMetadata);
    const metadata: DashboardMetaData = dashboardsMeta.find(
      ({ id }) => id === dashboardId
    );

    const blobApi = yield getContext(BLOB_API);
    yield blobApi.saveDashboard(dashboardId, serializedDashboard, metadata);
  } catch (err) {
    console.error(err);
  }
}

export function* createDashboard({
  payload,
}: ReturnType<typeof createDashboardAction>) {
  const { dashboardId } = payload;
  const serializedDashboard: Dashboard = {
    version: __APP_VERSION__,
    widgets: [],
  };

  yield put(registerDashboard(dashboardId));
  yield put(updateDashboard(dashboardId, serializedDashboard));

  yield put(setActiveDashboard(dashboardId));
  yield put(push(ROUTES.EDITOR));
}

export function* deleteDashboard({
  payload,
}: ReturnType<typeof deleteDashboardAction>) {
  const { dashboardId } = payload;

  try {
    const blobApi = yield getContext(BLOB_API);
    yield blobApi.deleteDashboard(dashboardId);

    yield put(deregisterDashboard(dashboardId));
  } catch (err) {
    console.error(err);
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
      const serializedDashboard = serializeDashboard(responseBody);
      const { widgets } = responseBody;

      yield put(registerWidgets(widgets));
      yield put(updateDashboard(dashboardId, serializedDashboard));

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
      const serializedDashboard = serializeDashboard(responseBody);
      const { widgets } = responseBody;

      yield put(registerWidgets(widgets));
      yield put(updateDashboard(dashboardId, serializedDashboard));
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
  yield takeLatest(DELETE_DASHBOARD, deleteDashboard);
  yield takeLatest(VIEW_DASHBOARD, viewDashboard);
  yield takeLatest(EDIT_DASHBOARD, editDashboard);
  yield takeLatest(INITIALIZE_DASHBOARD_WIDGETS, initializeDashboardWidgets);
}
