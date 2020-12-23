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

import {
  createWidget as createWidgetAction,
  initializeWidget as initializeWidgetAction,
  initializeChartWidget as initializeChartWidgetAction,
  setWidgetLoading,
  setWidgetState,
  openChartWidgetEditor,
  chartWidgetEditorRunQuerySuccess,
  chartWidgetEditorRunQueryError,
  resetChartWidgetEditor,
  closeChartWidgetEditor,
  finishChartWidgetConfiguration,
} from './actions';

import { getWidgetSettings, getChartWidgetEditor } from './selectors';

import { removeWidgetFromDashboard, saveDashboard } from '../dashboards';

import { SELECT_SAVED_QUERY, CREATE_QUERY, SavedQuery } from '../queries';
import {
  getActiveDashboard,
  showQueryPicker,
  hideQueryPicker,
  HIDE_QUERY_PICKER,
} from '../app';

import {
  CREATE_WIDGET,
  INITIALIZE_WIDGET,
  INITIALIZE_CHART_WIDGET,
  CHART_WIDGET_EDITOR_RUN_QUERY,
  CHART_WIDGET_EDITOR_APPLY_CONFIGURATION,
  CLOSE_CHART_WIDGET_EDITOR,
} from './constants';
import { KEEN_ANALYSIS } from '../../constants';

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

function* chartEditorPerformQuery() {
  const { querySettings } = yield select(getChartWidgetEditor);
  const keenAnalysis = yield getContext(KEEN_ANALYSIS);

  try {
    const analysisResult = yield keenAnalysis.query(querySettings);
    yield put(chartWidgetEditorRunQuerySuccess(analysisResult));
  } catch (err) {
    yield put(chartWidgetEditorRunQueryError());
    console.error(err);
  }
}

function* createNewQuery(widgetId: string) {
  yield put(openChartWidgetEditor());

  const action = yield take([
    CHART_WIDGET_EDITOR_APPLY_CONFIGURATION,
    CLOSE_CHART_WIDGET_EDITOR,
  ]);

  if (action.type === CLOSE_CHART_WIDGET_EDITOR) {
    yield cancelWidgetConfiguration(widgetId);
  } else {
    const { querySettings } = yield select(getChartWidgetEditor);
    yield put(
      finishChartWidgetConfiguration(widgetId, querySettings, 'table', {}, {})
    );

    yield put(closeChartWidgetEditor());
    yield put(initializeChartWidgetAction(widgetId));
    yield put(resetChartWidgetEditor());
  }
}

function* visualizationWizard(widgetId: string) {
  yield put(showQueryPicker());
  const action = yield take([
    SELECT_SAVED_QUERY,
    CREATE_QUERY,
    HIDE_QUERY_PICKER,
  ]);

  if (action.type === HIDE_QUERY_PICKER) {
    yield cancelWidgetConfiguration(widgetId);
  } else if (action.type === CREATE_QUERY) {
    yield put(hideQueryPicker());
    yield call(createNewQuery, widgetId);
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

function* createWidget({ payload }: ReturnType<typeof createWidgetAction>) {
  const { id } = payload;
  // @TODO: Implement different flows based on widget type
  yield fork(visualizationWizard, id);
}

export function* widgetsSaga() {
  yield takeLatest(CHART_WIDGET_EDITOR_RUN_QUERY, chartEditorPerformQuery);
  yield takeLatest(CREATE_WIDGET, createWidget);
  yield takeEvery(INITIALIZE_WIDGET, initializeWidget);
  yield takeEvery(INITIALIZE_CHART_WIDGET, initializeChartWidget);
}
