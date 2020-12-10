import {
  takeLatest,
  takeEvery,
  put,
  select,
  take,
  fork,
  getContext,
} from 'redux-saga/effects';

import {
  createWidget as createWidgetAction,
  initializeWidget as initializeWidgetAction,
  initializeChartWidget as initializeChartWidgetAction,
  setWidgetLoading,
  setWidgetState,
  finishChartWidgetConfiguration,
} from './actions';

import { getWidgetSettings } from './selectors';

import { removeWidgetFromDashboard } from '../dashboards';
import { SELECT_SAVED_QUERY, SavedQuery } from '../queries';
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

function* visualizationWizard(widgetId: string) {
  yield put(showQueryPicker());

  const action = yield take([SELECT_SAVED_QUERY, HIDE_QUERY_PICKER]);
  if (action.type === HIDE_QUERY_PICKER) {
    yield cancelWidgetConfiguration(widgetId);
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
  }
}

function* createWidget({ payload }: ReturnType<typeof createWidgetAction>) {
  const { id } = payload;
  // @TODO: Implement different flows based on widget type
  yield fork(visualizationWizard, id);
}

export function* widgetsSaga() {
  yield takeLatest(CREATE_WIDGET, createWidget);
  yield takeEvery(INITIALIZE_WIDGET, initializeWidget);
  yield takeEvery(INITIALIZE_CHART_WIDGET, initializeChartWidget);
}
