import { takeLatest, put, select, getContext } from 'redux-saga/effects';

import {
  fetchDashboardListSuccess,
  fetchDashboardListError,
  registerDashboard,
  updateDashboard,
  createDashboard as createDashboardAction,
  editDashboard as editDashboardAction,
  saveDashboard as saveDashboardAction,
} from './actions';

import { serializeDashboard } from './serializers';
import {
  getDashboard,
  getDashboardSettings,
  getDashboardsMetadata,
} from './selectors';

import { setViewMode } from '../app';
import { registerWidgets, getWidgetSettings } from '../widgets';

import { BLOB_API } from '../../constants';
import {
  FETCH_DASHBOARDS_LIST,
  CREATE_DASHBOARD,
  SAVE_DASHBOARD,
  EDIT_DASHBOARD,
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
  yield put(setViewMode('editor', dashboardId));
}

export function* editDashboard({
  payload,
}: ReturnType<typeof editDashboardAction>) {
  const { dashboardId } = payload;
  const state: RootState = yield select();
  const dashboard = yield getDashboard(state, dashboardId);

  if (!dashboard) {
    yield put(registerDashboard(dashboardId));
    yield put(setViewMode('editor', dashboardId));

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
    yield put(setViewMode('editor', dashboardId));
  }
}

export function* dashboardsSaga() {
  yield takeLatest(FETCH_DASHBOARDS_LIST, fetchDashboardList);
  yield takeLatest(CREATE_DASHBOARD, createDashboard);
  yield takeLatest(SAVE_DASHBOARD, saveDashboard);
  yield takeLatest(EDIT_DASHBOARD, editDashboard);
}
