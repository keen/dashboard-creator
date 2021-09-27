/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/naming-convention */
import {
  takeLatest,
  put,
  select,
  take,
  all,
  getContext,
  spawn,
  call,
  takeEvery,
} from 'redux-saga/effects';
import { push } from 'connected-react-router';
import { exportToHtml } from '@keen.io/ui-core';
import { Theme } from '@keen.io/charts';

import {
  fetchDashboardListSuccess,
  fetchDashboardListError,
  registerDashboard,
  updateDashboard,
  removeWidgetFromDashboard as removeWidgetFromDashboardAction,
  initializeDashboardWidgets as initializeDashboardWidgetsAction,
  createDashboard as createDashboardAction,
  editDashboard as editDashboardAction,
  saveDashboard as saveDashboardAction,
  saveDashboardMeta as saveDashboardMetaAction,
  viewDashboard as viewDashboardAction,
  setDashboardPublicAccess as setDashboardPublicAccessAction,
  regenerateAccessKey as regenerateAccessKeyAction,
  regenerateAccessKeySuccess,
  regenerateAccessKeyError,
  exportDashboardToHtml as exportDashboardToHtmlAction,
  setDashboardListOrder,
  updateCachedDashboardIds,
  unregisterDashboard,
  calculateYPositionAndAddWidget as calculateYPositionAndAddWidgetAction,
  addWidgetToDashboard,
} from './actions';

import {
  viewDashboard,
  viewPublicDashboard,
  saveDashboard,
  cloneDashboard,
  resetDashboardFilters,
  deleteAccessKey,
  deleteDashboard,
  editDashboard,
  saveDashboardMetadata,
  finishDashboardEdition,
} from './saga';

import {
  getCachedDashboardIds,
  getDashboard,
  getDashboardMeta,
} from './selectors';
import { themeSelectors } from '../theme/selectors';

import {
  initializeWidget,
  removeWidget,
  getWidget,
  getWidgetSettings,
  createWidget,
  createWidgetId,
} from '../widgets';

import {
  removeDatePickerConnections,
  removeConnectionFromDatePicker,
} from '../widgets/saga/datePickerWidget';

import { themeActions } from '../theme';
import {
  createDashboardSettings,
  createPublicDashboardKeyName,
  createCodeSnippet,
} from './utils';

import {
  DASHBOARD_API,
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
  VIEW_PUBLIC_DASHBOARD,
  SHOW_DELETE_CONFIRMATION,
  SET_DASHBOARD_LIST_ORDER,
  DASHBOARD_LIST_ORDER_KEY,
  SET_DASHBOARD_PUBLIC_ACCESS,
  UPDATE_ACCESS_KEY_OPTIONS,
  REGENERATE_ACCESS_KEY,
  CLONE_DASHBOARD,
  EXPORT_DASHBOARD_TO_HTML,
  CALCULATE_Y_POSITION_AND_ADD_WIDGET,
  SAVE_DASHBOARD_METADATA_SUCCESS,
  RESET_DASHBOARD_FILTERS,
  FINISH_DASHBOARD_EDITION,
} from './constants';

import { RootState } from '../../rootReducer';
import { DashboardModel, Dashboard, DashboardMetaData } from './types';
import { unregisterWidget } from '../widgets/actions';
import {
  removeConnectionFromFilter,
  removeFilterConnections,
} from '../widgets/saga/filterWidget';
import { getDroppingItemSize } from '../../utils';
import { findBiggestYPositionOfWidgets } from './utils/findBiggestYPositionOfWidgets';
import { appActions, appSelectors } from '../app';

export function* fetchDashboardList() {
  const dashboardApi = yield getContext(DASHBOARD_API);

  try {
    const responseBody = yield dashboardApi.getDashboards();

    yield put(fetchDashboardListSuccess(responseBody));
  } catch (err) {
    yield put(fetchDashboardListError());
  }
}

function* generateAccessKeyOptions(dashboardId: string) {
  const state: RootState = yield select();
  const dashboard = yield getDashboard(state, dashboardId);
  const queries = new Set();

  if (!dashboard) {
    const dashboardApi = yield getContext(DASHBOARD_API);

    try {
      const responseBody: DashboardModel = yield dashboardApi.getDashboardById(
        dashboardId
      );
      const { widgets } = responseBody;
      widgets.forEach((widget) => {
        if (
          widget.type === 'visualization' &&
          widget.query &&
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
      if (type === 'visualization' && query && typeof query === 'string') {
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

export function* updateAccessKeyOptions() {
  const state: RootState = yield select();
  const dashboardId = yield select(appSelectors.getActiveDashboard);
  const { isPublic } = yield getDashboardMeta(state, dashboardId);

  if (isPublic) {
    yield updateAccessKey(dashboardId);
  }
}

export function* createDashboard({
  payload,
}: ReturnType<typeof createDashboardAction>) {
  const { dashboardId } = payload;

  const theme: Theme = yield select(themeSelectors.getBaseTheme);
  const serializedDashboard: Dashboard = {
    version: __APP_VERSION__,
    widgets: [],
  };
  yield put(registerDashboard(dashboardId));
  yield put(updateDashboard(dashboardId, serializedDashboard));

  yield put(
    themeActions.setDashboardTheme({
      dashboardId,
      theme,
      settings: createDashboardSettings(),
    })
  );

  yield put(appActions.setActiveDashboard(dashboardId));
  yield put(push(ROUTES.EDITOR));

  yield put(saveDashboardAction(dashboardId));
}

export function* removeWidgetFromDashboard({
  payload,
}: ReturnType<typeof removeWidgetFromDashboardAction>) {
  const { dashboardId, widgetId } = payload;

  const { type, query, datePickerId, filterIds } = yield select(
    getWidgetSettings,
    widgetId
  );

  if (type === 'visualization' && query && typeof query === 'string') {
    yield call(updateAccessKeyOptions);
    if (datePickerId) {
      yield call(removeConnectionFromDatePicker, datePickerId, widgetId);
    }

    if (filterIds.length > 0) {
      yield all(
        filterIds.map((filterId: string) =>
          call(removeConnectionFromFilter, filterId, widgetId)
        )
      );
    }
  }

  if (type === 'date-picker') {
    yield call(removeDatePickerConnections, dashboardId, widgetId);
  }

  if (type === 'filter') {
    yield call(removeFilterConnections, dashboardId, widgetId);
  }

  yield put(removeWidget(widgetId));
}

export function* initializeDashboardWidgets({
  payload,
}: ReturnType<typeof initializeDashboardWidgetsAction>) {
  const { widgetsId } = payload;
  yield all(widgetsId.map((widgetId) => put(initializeWidget(widgetId))));
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
  const { dashboardId, isPublic, accessKey } = payload;
  const metadata = yield select(getDashboardMeta, dashboardId);

  if (accessKey) {
    yield put(saveDashboardMetaAction(dashboardId, metadata));
  } else {
    if (isPublic) {
      try {
        const accessKey = yield call(createAccessKey, dashboardId);
        const { key: publicAccessKey } = accessKey;

        const updatedMetadata: DashboardMetaData = {
          ...metadata,
          isPublic,
          publicAccessKey,
        };

        yield put(saveDashboardMetaAction(dashboardId, updatedMetadata));
      } catch (error) {
        const notificationManager = yield getContext(NOTIFICATION_MANAGER);
        yield notificationManager.showNotification({
          type: 'error',
          message: 'dashboard_share.access_key_api_error',
          showDismissButton: true,
          autoDismiss: false,
        });
      }
    }
  }
}

export function* regenerateAccessKey({
  payload,
}: ReturnType<typeof regenerateAccessKeyAction>) {
  const { dashboardId } = payload;
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
      yield take(SAVE_DASHBOARD_METADATA_SUCCESS);
      yield put(regenerateAccessKeySuccess());
    } catch (error) {
      yield put(regenerateAccessKeyError());
      const notificationManager = yield getContext(NOTIFICATION_MANAGER);
      yield notificationManager.showNotification({
        type: 'error',
        message: 'dashboard_share.access_key_api_error',
        showDismissButton: true,
        autoDismiss: false,
      });
    }
  }
}

export function* exportDashboardToHtml({
  payload,
}: ReturnType<typeof exportDashboardToHtmlAction>) {
  const { dashboardId } = payload;
  const client = yield getContext(KEEN_ANALYSIS);

  const { publicAccessKey } = yield select(getDashboardMeta, dashboardId);
  const { projectId } = client.config;

  const codeSnippet = yield createCodeSnippet({
    projectId,
    userKey: publicAccessKey,
    dashboardId,
  });
  exportToHtml({ data: codeSnippet, fileName: dashboardId });
}

export function* showDashboardDeleteConfirmation() {
  yield window.scrollTo(0, 0);
}

export function* updateCachedDashboardsList({
  payload,
}: ReturnType<typeof viewDashboardAction | typeof editDashboardAction>) {
  const { dashboardId } = payload;
  let [...cachedDashboardIds] = yield select(getCachedDashboardIds);
  const cachedDashboardsNumber = yield select(
    appSelectors.getCachedDashboardsNumber
  );
  if (cachedDashboardIds.includes(dashboardId)) {
    cachedDashboardIds.push(
      cachedDashboardIds.splice(cachedDashboardIds.indexOf(dashboardId), 1)[0]
    );
  } else if (cachedDashboardIds.length < cachedDashboardsNumber) {
    cachedDashboardIds.push(dashboardId);
  } else {
    const dashboardToUnregister = yield select(
      getDashboard,
      cachedDashboardIds[0]
    );
    if (dashboardToUnregister.settings) {
      const widgets = dashboardToUnregister.settings.widgets;
      yield all(widgets.map((widgetId) => put(unregisterWidget(widgetId))));
      yield put(unregisterDashboard(cachedDashboardIds[0]));
      cachedDashboardIds.push(dashboardId);
      cachedDashboardIds = cachedDashboardIds.splice(1, 3);
    }
  }
  yield put(updateCachedDashboardIds(cachedDashboardIds));
}

export function* calculateYPositionAndAddWidget({
  payload,
}: ReturnType<typeof calculateYPositionAndAddWidgetAction>) {
  const { dashboardId, widgetType } = payload;
  const dashboard = yield select(getDashboard, dashboardId);

  const widgets = yield all(
    dashboard.settings.widgets.map((id: string) => select(getWidget, id))
  );

  const widgetId = createWidgetId();
  const { w, h, minH, minW } = getDroppingItemSize(widgetType);

  yield put(
    createWidget(widgetId, widgetType, {
      x: 0,
      y: findBiggestYPositionOfWidgets(widgets) + 1,
      w,
      h,
      minW,
      minH,
    })
  );
  yield put(addWidgetToDashboard(dashboardId, widgetId));
}

export function* dashboardsSaga() {
  yield spawn(rehydrateDashboardsOrder);
  yield takeLatest(FETCH_DASHBOARDS_LIST, fetchDashboardList);
  yield takeLatest(SET_DASHBOARD_LIST_ORDER, persistDashboardsOrder);
  yield takeLatest(CREATE_DASHBOARD, createDashboard);
  yield takeLatest(SAVE_DASHBOARD, saveDashboard);
  yield takeLatest(SAVE_DASHBOARD_METADATA, saveDashboardMetadata);
  yield takeLatest(DELETE_DASHBOARD, deleteDashboard);
  yield takeLatest(VIEW_DASHBOARD, viewDashboard);
  yield takeLatest(VIEW_PUBLIC_DASHBOARD, viewPublicDashboard);
  yield takeLatest(EDIT_DASHBOARD, editDashboard);
  yield takeLatest(REMOVE_WIDGET_FROM_DASHBOARD, removeWidgetFromDashboard);
  yield takeLatest(INITIALIZE_DASHBOARD_WIDGETS, initializeDashboardWidgets);
  yield takeLatest(SHOW_DELETE_CONFIRMATION, showDashboardDeleteConfirmation);
  yield takeLatest(SET_DASHBOARD_PUBLIC_ACCESS, setAccessKey);
  yield takeLatest(UPDATE_ACCESS_KEY_OPTIONS, updateAccessKeyOptions);
  yield takeLatest(REGENERATE_ACCESS_KEY, regenerateAccessKey);
  yield takeLatest(CLONE_DASHBOARD, cloneDashboard);
  yield takeLatest(EXPORT_DASHBOARD_TO_HTML, exportDashboardToHtml);
  yield takeEvery([VIEW_DASHBOARD, EDIT_DASHBOARD], updateCachedDashboardsList);
  yield takeEvery(
    CALCULATE_Y_POSITION_AND_ADD_WIDGET,
    calculateYPositionAndAddWidget
  );
  yield takeEvery(RESET_DASHBOARD_FILTERS, resetDashboardFilters);
  yield takeEvery(FINISH_DASHBOARD_EDITION, finishDashboardEdition);
}
