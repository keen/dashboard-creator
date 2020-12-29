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
  setWidgetLoading,
  setWidgetState,
  finishChartWidgetConfiguration,
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
  showQueryChangeConfirmation,
  hideQueryChangeConfirmation,
  CLOSE_EDITOR,
  EDITOR_MOUNTED,
  APPLY_CONFIGURATION,
  CONFIRM_SAVE_QUERY_UPDATE,
  HIDE_QUERY_CHANGE_CONFIRMATION,
  USE_QUERY_FOR_WIDGET,
} from '../chartEditor';

import {
  updateSaveQuery,
  SELECT_SAVED_QUERY,
  CREATE_QUERY,
  SavedQuery,
} from '../queries';
import {
  getActiveDashboard,
  showQueryPicker,
  hideQueryPicker,
  HIDE_QUERY_PICKER,
} from '../app';

import {
  CREATE_WIDGET,
  EDIT_CHART_WIDGET,
  INITIALIZE_WIDGET,
  INITIALIZE_CHART_WIDGET,
} from './constants';
import { PUBSUB, KEEN_ANALYSIS } from '../../constants';

import { ChartWidget } from './types';

// TODO: Handle API error for widget

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

function* initializeWidget({
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

// TODO: Refactor logic
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
      hasQueryChanged,
      querySettings,
    } = yield select(getChartEditor);

    const widgetState = {
      isInitialized: false,
      isConfigured: false,
      data: null,
    };

    if (isSavedQuery && hasQueryChanged) {
      yield put(closeEditor());
      yield put(showQueryChangeConfirmation());

      const confirmAction = yield take([
        HIDE_QUERY_CHANGE_CONFIRMATION,
        CONFIRM_SAVE_QUERY_UPDATE,
        USE_QUERY_FOR_WIDGET,
      ]);
      if (confirmAction.type === USE_QUERY_FOR_WIDGET) {
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
      } else if (confirmAction.type === HIDE_QUERY_CHANGE_CONFIRMATION) {
        yield put(hideQueryChangeConfirmation());
        yield put(resetEditor());
        return;
      } else if (confirmAction.type === CONFIRM_SAVE_QUERY_UPDATE) {
        try {
          const { query: queryName } = yield select(getWidgetSettings, id);
          yield* updateSaveQuery(queryName, querySettings);

          yield put(setWidgetState(id, widgetState));
          yield put(
            finishChartWidgetConfiguration(
              id,
              queryName,
              widgetType,
              chartSettings,
              widgetSettings
            )
          );
        } catch (err) {}
      }
    } else if (isSavedQuery) {
      yield put(closeEditor());
      yield put(setWidgetState(id, widgetState));
      const { query: queryName } = yield select(getWidgetSettings, id);

      yield put(
        finishChartWidgetConfiguration(
          id,
          queryName,
          widgetType,
          chartSettings,
          widgetSettings
        )
      );
    } else {
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
    }

    yield put(initializeChartWidgetAction(id));
    yield put(closeEditor());

    const dashboardId = yield select(getActiveDashboard);
    yield put(saveDashboard(dashboardId));

    yield put(resetEditor());
  }
}

export function* createWidget({
  payload,
}: ReturnType<typeof createWidgetAction>) {
  const { id } = payload;
  // @TODO: Implement different flows based on widget type
  yield fork(selectQueryForWidget, id);
}

export function* widgetsSaga() {
  yield takeLatest(CREATE_WIDGET, createWidget);
  yield takeLatest(EDIT_CHART_WIDGET, editChartWidget);
  yield takeEvery(INITIALIZE_WIDGET, initializeWidget);
  yield takeEvery(INITIALIZE_CHART_WIDGET, initializeChartWidget);
}
