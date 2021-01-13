import {
  takeLatest,
  takeEvery,
  put,
  select,
  take,
  fork,
  call,
  getContext,
} from 'redux-saga/effects';
import { SET_QUERY_EVENT } from '@keen.io/query-creator';

import {
  createWidget as createWidgetAction,
  initializeWidget as initializeWidgetAction,
  initializeChartWidget as initializeChartWidgetAction,
  editChartWidget as editChartWidgetAction,
  editImageWidget as editImageWidgetAction,
  setWidgetLoading,
  setWidgetState,
  finishChartWidgetConfiguration,
  configureImageWidget,
} from './actions';

import { getWidgetSettings, getWidget } from './selectors';

import { removeWidgetFromDashboard, saveDashboard } from '../dashboards';
import {
  openEditor,
  closeEditor,
  resetEditor,
  getChartEditor,
  setEditMode,
  setQueryType,
  setQuerySettings,
  setQueryResult,
  setVisualizationSettings,
  showQueryUpdateConfirmation,
  hideQueryUpdateConfirmation,
  CLOSE_EDITOR,
  EDITOR_MOUNTED,
  APPLY_CONFIGURATION,
  CONFIRM_SAVE_QUERY_UPDATE,
  HIDE_QUERY_UPDATE_CONFIRMATION,
  USE_QUERY_FOR_WIDGET,
} from '../chartEditor';

import {
  updateSaveQuery,
  SELECT_SAVED_QUERY,
  CREATE_QUERY,
  SAVE_IMAGE,
  SavedQuery,
} from '../queries';
import {
  getActiveDashboard,
  showQueryPicker,
  hideQueryPicker,
  showImagePicker,
  hideImagePicker,
  HIDE_QUERY_PICKER,
  HIDE_IMAGE_PICKER,
} from '../app';

import {
  CREATE_WIDGET,
  EDIT_CHART_WIDGET,
  EDIT_IMAGE_WIDGET,
  INITIALIZE_WIDGET,
  INITIALIZE_CHART_WIDGET,
} from './constants';
import { PUBSUB, KEEN_ANALYSIS, NOTIFICATION_MANAGER } from '../../constants';

import { ChartWidget } from './types';

function* initializeChartWidget({
  payload,
}: ReturnType<typeof initializeChartWidgetAction>) {
  const { id } = payload;
  const { query } = yield select(getWidgetSettings, id);

  try {
    const requestBody =
      typeof query === 'string' ? { savedQueryName: query } : query;
    const keenAnalysis = yield getContext(KEEN_ANALYSIS);

    yield put(setWidgetLoading(id, true));

    const analysisResult = yield keenAnalysis.query(requestBody);
    const widgetState = {
      isInitialized: true,
      data: analysisResult,
    };

    yield put(setWidgetState(id, widgetState));
  } catch (err) {
    const { body } = err;
    yield put(
      setWidgetState(id, {
        isInitialized: true,
        error: body,
      })
    );
  } finally {
    yield put(setWidgetLoading(id, false));
  }
}

export function* initializeWidget({
  payload,
}: ReturnType<typeof initializeWidgetAction>) {
  const { id } = payload;
  const { type } = yield select(getWidgetSettings, id);
  if (type === 'visualization') {
    yield put(initializeChartWidgetAction(id));
  }
}

function* cancelWidgetConfiguration(widgetId: string) {
  const dashboardId = yield select(getActiveDashboard);
  yield put(removeWidgetFromDashboard(dashboardId, widgetId));
}

/**
 * Flow responsible for creating ad-hoc query for chart widget.
 *
 * @param widgetId - Widget identifer
 * @return void
 *
 */
export function* createQueryForWidget(widgetId: string) {
  yield put(openEditor());
  const action = yield take([CLOSE_EDITOR, APPLY_CONFIGURATION]);

  if (action.type === CLOSE_EDITOR) {
    yield* cancelWidgetConfiguration(widgetId);
  } else {
    const {
      querySettings,
      visualization: { type, chartSettings, widgetSettings },
    } = yield select(getChartEditor);

    yield put(
      finishChartWidgetConfiguration(
        widgetId,
        querySettings,
        type,
        chartSettings,
        widgetSettings
      )
    );

    yield put(closeEditor());
    yield put(initializeChartWidgetAction(widgetId));
    yield put(resetEditor());

    const dashboardId = yield select(getActiveDashboard);
    yield put(saveDashboard(dashboardId));
  }
}

export function* selectImageWidget(widgetId: string) {
  yield put(showImagePicker());
  const action = yield take([SAVE_IMAGE, HIDE_IMAGE_PICKER]);

  if (action.type === HIDE_IMAGE_PICKER) {
    yield* cancelWidgetConfiguration(widgetId);
  } else {
    yield put(configureImageWidget(widgetId, action.payload.link));
    yield put(
      setWidgetState(widgetId, {
        isConfigured: true,
      })
    );
    yield put(hideImagePicker());
    const dashboardId = yield select(getActiveDashboard);
    yield put(saveDashboard(dashboardId));
  }
}

/**
 * Initial flow for creating chart widget.
 *
 * @param widgetId - Widget identifer
 * @return void
 *
 */
export function* selectQueryForWidget(widgetId: string) {
  yield put(showQueryPicker());
  const action = yield take([
    SELECT_SAVED_QUERY,
    CREATE_QUERY,
    HIDE_QUERY_PICKER,
  ]);

  if (action.type === HIDE_QUERY_PICKER) {
    yield* cancelWidgetConfiguration(widgetId);
  } else if (action.type === CREATE_QUERY) {
    yield put(hideQueryPicker());
    yield call(createQueryForWidget, widgetId);
  } else if (action.type === SELECT_SAVED_QUERY) {
    const {
      query: {
        id: queryId,
        visualization: { type: widgetType, chartSettings, widgetSettings },
      },
    } = action.payload as { query: SavedQuery };

    yield put(hideQueryPicker());
    yield put(
      finishChartWidgetConfiguration(
        widgetId,
        queryId,
        widgetType,
        chartSettings,
        widgetSettings
      )
    );
    yield put(initializeChartWidgetAction(widgetId));

    const dashboardId = yield select(getActiveDashboard);
    yield put(saveDashboard(dashboardId));
  }
}

/**
 * Flow responsible for editing widget connected
 * with saved query.
 *
 * @param widgetId - Widget identifer
 * @return void
 *
 */
export function* editChartSavedQuery(widgetId: string) {
  const {
    visualization: { type: widgetType, chartSettings, widgetSettings },
    hasQueryChanged,
    querySettings,
  } = yield select(getChartEditor);

  const widgetState = {
    isInitialized: false,
    isConfigured: false,
    data: null,
  };

  if (hasQueryChanged) {
    yield put(closeEditor());
    yield put(showQueryUpdateConfirmation());

    const action = yield take([
      HIDE_QUERY_UPDATE_CONFIRMATION,
      CONFIRM_SAVE_QUERY_UPDATE,
      USE_QUERY_FOR_WIDGET,
    ]);

    if (action.type === USE_QUERY_FOR_WIDGET) {
      yield put(setWidgetState(widgetId, widgetState));
      yield put(
        finishChartWidgetConfiguration(
          widgetId,
          querySettings,
          widgetType,
          chartSettings,
          widgetSettings
        )
      );

      yield put(initializeChartWidgetAction(widgetId));

      const dashboardId = yield select(getActiveDashboard);
      yield put(saveDashboard(dashboardId));
    } else if (action.type === CONFIRM_SAVE_QUERY_UPDATE) {
      try {
        const { query: queryName } = yield select(getWidgetSettings, widgetId);
        yield* updateSaveQuery(queryName, querySettings);

        yield put(setWidgetState(widgetId, widgetState));
        yield put(
          finishChartWidgetConfiguration(
            widgetId,
            queryName,
            widgetType,
            chartSettings,
            widgetSettings
          )
        );

        yield put(initializeChartWidgetAction(widgetId));

        const dashboardId = yield select(getActiveDashboard);
        yield put(saveDashboard(dashboardId));
      } catch (err) {
        const notificationManager = yield getContext(NOTIFICATION_MANAGER);
        yield notificationManager.showNotification({
          type: 'error',
          translateMessage: true,
          message: 'notifications.update_save_query_error',
        });
      }
    }

    yield put(hideQueryUpdateConfirmation());
    yield put(resetEditor());
  } else {
    yield put(closeEditor());
    yield put(setWidgetState(widgetId, widgetState));
    const { query: queryName } = yield select(getWidgetSettings, widgetId);

    yield put(
      finishChartWidgetConfiguration(
        widgetId,
        queryName,
        widgetType,
        chartSettings,
        widgetSettings
      )
    );

    yield put(initializeChartWidgetAction(widgetId));

    const dashboardId = yield select(getActiveDashboard);
    yield put(saveDashboard(dashboardId));
    yield put(resetEditor());
  }
}

/**
 * Flow responsible for editing chart widget.
 *
 * @param widgetId - Widget identifer
 * @return void
 *
 */
export function* editChartWidget({
  payload,
}: ReturnType<typeof editChartWidgetAction>) {
  const { id } = payload;

  const state = yield select();
  const widgetItem = getWidget(state, id);

  const {
    widget,
    data: { query },
  } = widgetItem;

  const {
    query: widgetQuery,
    settings: { visualizationType, chartSettings, widgetSettings },
  } = widget as ChartWidget;
  const isSavedQuery = typeof widgetQuery === 'string';

  yield put(setQueryType(isSavedQuery));

  yield put(
    setVisualizationSettings(visualizationType, chartSettings, widgetSettings)
  );
  yield put(setEditMode(true));
  yield put(setQuerySettings(query));
  yield put(setQueryResult(widgetItem.data));

  yield put(openEditor());

  yield take(EDITOR_MOUNTED);
  const pubsub = yield getContext(PUBSUB);
  yield pubsub.publish(SET_QUERY_EVENT, { query });

  const action = yield take([CLOSE_EDITOR, APPLY_CONFIGURATION]);

  if (action.type === CLOSE_EDITOR) {
    yield put(resetEditor());
  } else {
    const {
      isSavedQuery,
      visualization: { type: widgetType, chartSettings, widgetSettings },
      querySettings,
    } = yield select(getChartEditor);

    if (isSavedQuery) {
      yield* editChartSavedQuery(id);
    } else {
      const widgetState = {
        isInitialized: false,
        isConfigured: false,
        data: null,
      };

      yield put(setWidgetState(id, widgetState));
      yield put(
        finishChartWidgetConfiguration(
          id,
          querySettings,
          widgetType,
          chartSettings,
          widgetSettings
        )
      );

      yield put(initializeChartWidgetAction(id));
      yield put(closeEditor());

      const dashboardId = yield select(getActiveDashboard);
      yield put(saveDashboard(dashboardId));

      yield put(resetEditor());
    }
  }
}

export function* editImageWidget({
  payload,
}: ReturnType<typeof editImageWidgetAction>) {
  const { id } = payload;

  const state = yield select();
  const widgetId = getWidget(state, id).widget.id;

  yield put(showImagePicker());
  const action = yield take([SAVE_IMAGE]);

  if (action.type === SAVE_IMAGE) {
    yield put(configureImageWidget(widgetId, action.payload.link));
    yield put(hideImagePicker());

    const dashboardId = yield select(getActiveDashboard);
    yield put(saveDashboard(dashboardId));
  } else {
    cancelWidgetConfiguration(widgetId);
  }
}

export function* createWidget({
  payload,
}: ReturnType<typeof createWidgetAction>) {
  const { id, widgetType } = payload;
  if (widgetType === 'image') {
    yield fork(selectImageWidget, id);
  } else {
    yield fork(selectQueryForWidget, id);
  }
}

export function* widgetsSaga() {
  yield takeLatest(CREATE_WIDGET, createWidget);
  yield takeLatest(EDIT_CHART_WIDGET, editChartWidget);
  yield takeLatest(EDIT_IMAGE_WIDGET, editImageWidget);
  yield takeEvery(INITIALIZE_WIDGET, initializeWidget);
  yield takeEvery(INITIALIZE_CHART_WIDGET, initializeChartWidget);
}
