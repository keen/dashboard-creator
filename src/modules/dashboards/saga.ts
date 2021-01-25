/* eslint-disable @typescript-eslint/camelcase */
import {
  takeLatest,
  put,
  select,
  take,
  all,
  getContext,
  spawn,
  call,
} from 'redux-saga/effects';
import { StatusCodes } from 'http-status-codes';
import { push } from 'connected-react-router';
import { Theme } from '@keen.io/charts';

import {
  fetchDashboardListSuccess,
  fetchDashboardListError,
  registerDashboard,
  updateDashboard,
  deleteDashboardSuccess,
  saveDashboardSuccess,
  saveDashboardError,
  updateDashboardMeta,
  removeWidgetFromDashboard as removeWidgetFromDashboardAction,
  initializeDashboardWidgets as initializeDashboardWidgetsAction,
  createDashboard as createDashboardAction,
  editDashboard as editDashboardAction,
  saveDashboard as saveDashboardAction,
  saveDashboardMeta as saveDashboardMetaAction,
  viewDashboard as viewDashboardAction,
  deleteDashboard as deleteDashboardAction,
  setDashboardPublicAccess as setDashboardPublicAccessAction,
  regenerateAccessKey as regenerateAccessKeyAction,
  showDeleteConfirmation,
  hideDeleteConfirmation,
  saveDashboardMetaSuccess,
  saveDashboardMetaError,
  setTagsPool,
  setDashboardListOrder,
} from './actions';

import { serializeDashboard } from './serializers';
import {
  getDashboard,
  getDashboardMeta,
  getDashboardSettings,
  getDashboardsMetadata,
} from './selectors';
import { getBaseTheme, getActiveDashboardTheme } from '../theme/selectors';

import { setActiveDashboard, getActiveDashboard } from '../app';
import {
  initializeWidget,
  registerWidgets,
  removeWidget,
  getWidget,
  getWidgetSettings,
} from '../widgets';
import { removeDashboardTheme, setDashboardTheme } from '../theme';
import { createTagsPool, createPublicDashboardKeyName } from './utils';

import {
  BLOB_API,
  KEEN_ANALYSIS,
  NOTIFICATION_MANAGER,
  ROUTES,
} from '../../constants';
import {
  INITIALIZE_DASHBOARD_WIDGETS,
  FETCH_DASHBOARDS_LIST,
  CREATE_DASHBOARD,
  SAVE_DASHBOARD,
  SAVE_DASHBOARD_METADATA,
  EDIT_DASHBOARD,
  REMOVE_WIDGET_FROM_DASHBOARD,
  DELETE_DASHBOARD,
  VIEW_DASHBOARD,
  CONFIRM_DASHBOARD_DELETE,
  HIDE_DELETE_CONFIRMATION,
  SHOW_DASHBOARD_SETTINGS_MODAL,
  HIDE_DASHBOARD_SETTINGS_MODAL,
  SAVE_DASHBOARD_METADATA_SUCCESS,
  SET_DASHBOARD_LIST_ORDER,
  DASHBOARD_LIST_ORDER_KEY,
  SET_DASHBOARD_PUBLIC_ACCESS,
  UPDATE_ACCESS_KEY_OPTIONS,
  REGENERATE_ACCESS_KEY,
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
  const notificationManager = yield getContext(NOTIFICATION_MANAGER);

  try {
    const blobApi = yield getContext(BLOB_API);
    yield blobApi.saveDashboardMeta(dashboardId, metadata);

    yield put(saveDashboardMetaSuccess());
    yield notificationManager.showNotification({
      type: 'info',
      message: 'notifications.dashboard_meta_success',
      autoDismiss: true,
    });
  } catch (err) {
    yield put(saveDashboardMetaError());
    yield notificationManager.showNotification({
      type: 'error',
      message: err,
      showDismissButton: true,
      autoDismiss: false,
    });
  }
}

function* generateAccessKeyOptions(dashboardId) {
  const state: RootState = yield select();
  const dashboard = yield getDashboard(state, dashboardId);
  const queries = new Set();

  if (!dashboard) {
    const blobApi = yield getContext(BLOB_API);

    try {
      const responseBody: DashboardModel = yield blobApi.getDashboardById(
        dashboardId
      );
      const { widgets } = responseBody;
      widgets.forEach((widget) => {
        if (
          widget.type === 'visualization' &&
          typeof widget.query === 'string'
        ) {
          queries.add(widget.query);
        }
      });
    } catch (err) {
      console.error(err);
    }
  } else {
    const {
      settings: { widgets },
    } = dashboard;
    const dashboardWidgets = widgets.map((widgetId: string) =>
      getWidget(state, widgetId)
    );
    dashboardWidgets.forEach((item) => {
      const {
        widget: { type, query },
      } = item;
      if (type === 'visualization' && typeof query === 'string') {
        queries.add(query);
      }
    });
  }

  const allowedQueries = Array.from(queries);
  return {
    options: {
      cached_queries: {
        allowed: allowedQueries,
      },
      saved_queries: {
        allowed: allowedQueries,
      },
    },
  };
}

// function* getAccessKeys() {
//   const client = yield getContext(KEEN_ANALYSIS);
//   const accessKeys = yield client
//     .get(client.url('projectId', 'keys'))
//     .auth(client.masterKey())
//     .send();

//   return accessKeys;
// }

// export function* getAccessKey(keyName: string) {
//   const client = yield getContext(KEEN_ANALYSIS);
//   const accessKey = yield client
//     .get(client.url('projectId', `keys?name=${keyName}`))
//     .auth(client.masterKey())
//     .send();

//   return accessKey;
// }

export function* createAccessKey(dashboardId: string) {
  const client = yield getContext(KEEN_ANALYSIS);
  const options = yield generateAccessKeyOptions(dashboardId);
  const params = {
    name: createPublicDashboardKeyName(dashboardId),
    isActive: true,
    permitted: ['queries', 'saved_queries', 'cached_queries', 'schema'],
    ...options,
  };
  const accessKey = yield client.post({
    url: client.url('projectId', 'keys'),
    api_key: client.masterKey(),
    params,
  });
  return accessKey;
}

export function* updateAccessKey(dashboardId: string) {
  const state: RootState = yield select();
  const { publicAccessKey } = yield getDashboardMeta(state, dashboardId);
  const client = yield getContext(KEEN_ANALYSIS);
  const options = yield generateAccessKeyOptions(dashboardId);
  const params = {
    name: createPublicDashboardKeyName(dashboardId),
    isActive: true,
    permitted: ['queries', 'saved_queries', 'cached_queries', 'schema'],
    ...options,
  };

  yield client.post({
    url: client.url('projectId', 'keys', publicAccessKey),
    api_key: client.masterKey(),
    params,
  });
}

export function* deleteAccessKey(publicAcessKey: string) {
  const client = yield getContext(KEEN_ANALYSIS);
  yield client.del({
    url: client.url('projectId', `keys/${publicAcessKey}`),
    api_key: client.masterKey(),
  });
}

export function* updateAccessKeyOptions() {
  const state: RootState = yield select();
  const dashboardId = yield select(getActiveDashboard);
  const { isPublic } = yield getDashboardMeta(state, dashboardId);

  if (isPublic) {
    yield updateAccessKey(dashboardId);
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

    yield put(updateDashboardMeta(dashboardId, updatedMetadata));
    yield put(saveDashboardSuccess(dashboardId));
  } catch (err) {
    yield put(saveDashboardError(dashboardId));
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
  const { publicAccessKey } = yield select(getDashboardMeta, dashboardId);
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

      yield put(deleteDashboardSuccess(dashboardId));
      yield put(removeDashboardTheme(dashboardId));

      yield notificationManager.showNotification({
        type: 'info',
        message: 'notifications.dashboard_delete_success',
        autoDismiss: true,
      });

      if (publicAccessKey) {
        yield call(deleteAccessKey, publicAccessKey);
      }
    } catch (err) {
      yield notificationManager.showNotification({
        type: 'error',
        message: 'notifications.dashboard_delete_error',
        showDismissButton: true,
        autoDismiss: false,
      });
    }

    // if (publicAccessKey) {
    //   try {
    //     yield deleteAccessKey(publicAccessKey);
    //   } catch (error) {
    //     console.error(error);
    //   }
    // }
  }
}

export function* removeWidgetFromDashboard({
  payload,
}: ReturnType<typeof removeWidgetFromDashboardAction>) {
  const { widgetId } = payload;

  // const state: RootState = yield select();
  // const { type, query } = yield getWidgetSettings(state, widgetId);
  const { type, query } = yield select(getWidgetSettings, widgetId);
  if (type === 'visualization' && query && typeof query === 'string') {
    yield call(updateAccessKeyOptions);
  }

  yield put(removeWidget(widgetId));
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

export function* showDashboardSettings() {
  const dashboards = yield select(getDashboardsMetadata);
  const tagsPool = createTagsPool(dashboards);
  yield put(setTagsPool(tagsPool));
}

export function* hideDashboardSettings() {
  yield put(setTagsPool([]));
}

export function* rehydrateDashboardsOrder() {
  try {
    const settings = localStorage.getItem(DASHBOARD_LIST_ORDER_KEY);
    if (settings) {
      const { order } = JSON.parse(settings);
      yield put(setDashboardListOrder(order));
    }
  } catch (err) {
    console.error(err);
  }
}

export function* persistDashboardsOrder({
  payload,
}: ReturnType<typeof setDashboardListOrder>) {
  const { order } = payload;
  try {
    localStorage.setItem(DASHBOARD_LIST_ORDER_KEY, JSON.stringify({ order }));
  } catch (err) {
    console.error(err);
  }
}

export function* setAccessKey({
  payload,
}: ReturnType<typeof setDashboardPublicAccessAction>) {
  const { dashboardId, isPublic } = payload;

  const state: RootState = yield select();
  const metadata = yield getDashboardMeta(state, dashboardId);

  if (isPublic) {
    try {
      const accessKey = yield createAccessKey(dashboardId);
      const { key: publicAccessKey } = accessKey;
      const updatedMetadata: DashboardMetaData = {
        ...metadata,
        publicAccessKey,
      };

      yield put(saveDashboardMetaAction(dashboardId, updatedMetadata));
    } catch (error) {
      console.log(error);
    }
  } else {
    const { publicAccessKey } = metadata;
    const updatedMetadata: DashboardMetaData = {
      ...metadata,
      publicAccessKey: null,
    };

    if (publicAccessKey) {
      try {
        yield call(deleteAccessKey, publicAccessKey);
        yield put(saveDashboardMetaAction(dashboardId, updatedMetadata));
      } catch (error) {
        console.error(error);
        if (error.status === StatusCodes.NOT_FOUND)
          yield put(saveDashboardMetaAction(dashboardId, updatedMetadata));
      }
    }
  }
}

export function* regenerateAccessKey({
  payload,
}: ReturnType<typeof regenerateAccessKeyAction>) {
  const { dashboardId } = payload;
  // const state: RootState = yield select();
  const metadata = yield select(getDashboardMeta, dashboardId);
  const { publicAccessKey } = metadata;

  if (publicAccessKey) {
    try {
      yield call(deleteAccessKey, publicAccessKey);

      const accessKey = yield call(createAccessKey, dashboardId);
      const { key } = accessKey;
      const updatedMetadata: DashboardMetaData = {
        ...metadata,
        publicAccessKey: key,
      };

      yield put(saveDashboardMetaAction(dashboardId, updatedMetadata));
    } catch (error) {
      console.error(error);
    }
  }
}

export function* dashboardsSaga() {
  yield spawn(rehydrateDashboardsOrder);
  yield takeLatest(
    [FETCH_DASHBOARDS_LIST, SAVE_DASHBOARD_METADATA_SUCCESS],
    fetchDashboardList
  );
  yield takeLatest(SET_DASHBOARD_LIST_ORDER, persistDashboardsOrder);
  yield takeLatest(CREATE_DASHBOARD, createDashboard);
  yield takeLatest(SAVE_DASHBOARD, saveDashboard);
  yield takeLatest(SAVE_DASHBOARD_METADATA, saveDashboardMetadata);
  yield takeLatest(DELETE_DASHBOARD, deleteDashboard);
  yield takeLatest(VIEW_DASHBOARD, viewDashboard);
  yield takeLatest(EDIT_DASHBOARD, editDashboard);
  yield takeLatest(REMOVE_WIDGET_FROM_DASHBOARD, removeWidgetFromDashboard);
  yield takeLatest(INITIALIZE_DASHBOARD_WIDGETS, initializeDashboardWidgets);
  yield takeLatest(SHOW_DASHBOARD_SETTINGS_MODAL, showDashboardSettings);
  yield takeLatest(HIDE_DASHBOARD_SETTINGS_MODAL, hideDashboardSettings);
  yield takeLatest(SET_DASHBOARD_PUBLIC_ACCESS, setAccessKey);
  yield takeLatest(UPDATE_ACCESS_KEY_OPTIONS, updateAccessKeyOptions);
  yield takeLatest(REGENERATE_ACCESS_KEY, regenerateAccessKey);
}
