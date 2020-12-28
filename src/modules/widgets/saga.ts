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
  setQuerySettings,
  setQueryResult,
  setVisualizationSettings,
  CLOSE_EDITOR,
  EDITOR_MOUNTED,
  APPLY_CONFIGURATION,
} from '../chartEditor';

import { SELECT_SAVED_QUERY, CREATE_QUERY, SavedQuery } from '../queries';
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
    console.error(err);
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

// TODO: Implement save query edit

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
    settings: { visualizationType, chartSettings, widgetSettings },
  } = widget as ChartWidget;
  //  const isSavedQuery = typeof widgetQuery === 'string';

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
