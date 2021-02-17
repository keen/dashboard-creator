import {
  takeLatest,
  takeEvery,
  put,
  select,
  take,
  fork,
  call,
  all,
} from 'redux-saga/effects';

import {
  createWidget as createWidgetAction,
  initializeWidget as initializeWidgetAction,
  initializeChartWidget as initializeChartWidgetAction,
  cloneWidget as cloneWidgetAction,
  setWidgetState,
  finishChartWidgetConfiguration,
  savedQueryUpdated,
  saveClonedWidget,
} from './actions';

import { getWidgetSettings, getWidget } from './selectors';

import {
  removeWidgetFromDashboard,
  saveDashboard,
  getDashboardSettings,
  updateAccessKeyOptions,
  addWidgetToDashboard,
  ADD_WIDGET_TO_DASHBOARD,
} from '../dashboards';
import {
  openEditor,
  closeEditor,
  resetEditor,
  getChartEditor,
  CLOSE_EDITOR as CLOSE_CHART_EDITOR,
  EDITOR_UNMOUNTED,
  APPLY_CONFIGURATION,
} from '../chartEditor';

import {
  setupDatePicker,
  resetDatePickerWidgets,
  setDatePickerModifiers,
  clearDatePickerModifiers,
  applyDatePickerModifiers,
  editDatePickerWidget,
} from './saga/datePickerWidget';
import { selectImageWidget, editImageWidget } from './saga/imageWidget';
import {
  createTextWidget,
  editTextWidget,
  editInlineTextWidget,
} from './saga/textWidget';

import { initializeChartWidget, editChartWidget } from './saga/chartWidget';

import { SELECT_SAVED_QUERY, CREATE_QUERY, SavedQuery } from '../queries';
import {
  getActiveDashboard,
  showQueryPicker,
  hideQueryPicker,
  HIDE_QUERY_PICKER,
} from '../app';
import { createWidgetId } from './utils';

import {
  CREATE_WIDGET,
  EDIT_INLINE_TEXT_WIDGET,
  EDIT_TEXT_WIDGET,
  EDIT_CHART_WIDGET,
  EDIT_IMAGE_WIDGET,
  EDIT_DATE_PICKER_WIDGET,
  INITIALIZE_WIDGET,
  INITIALIZE_CHART_WIDGET,
  APPLY_DATE_PICKER_MODIFIERS,
  CLEAR_DATE_PICKER_MODIFIERS,
  SET_DATE_PICKER_WIDGET_MODIFIERS,
  RESET_DATE_PICKER_WIDGETS,
  SAVED_QUERY_UPDATED,
  CLONE_WIDGET,
} from './constants';

import { ChartWidget, WidgetItem } from './types';
import { setupFilterWidget } from './saga/filterWidget';

/**
 * Flow responsible for re-initializing widgets after updating saved query.
 *
 * @param queryId - Saved query identifer
 * @return void
 *
 */
export function* reinitializeWidgets({
  payload,
}: ReturnType<typeof savedQueryUpdated>) {
  const { widgetId, queryId } = payload;
  const dashboardId = yield select(getActiveDashboard);

  const { widgets } = yield select(getDashboardSettings, dashboardId);
  const widgetState: Partial<WidgetItem> = {
    isInitialized: false,
    error: null,
    data: null,
  };

  const widgetsSettings = yield all(
    widgets.map((id: string) => select(getWidgetSettings, id))
  );

  const widgetsToUpdate = widgetsSettings.filter(
    ({ id, type, query }) =>
      id !== widgetId && type === 'visualization' && query === queryId
  );

  yield all(
    widgetsToUpdate.map(({ id }) => put(setWidgetState(id, widgetState)))
  );
  yield all(
    widgetsToUpdate.map(({ id }) => put(initializeChartWidgetAction(id)))
  );
}

export function* initializeWidget({
  payload,
}: ReturnType<typeof initializeWidgetAction>) {
  const { id } = payload;
  const { type } = yield select(getWidgetSettings, id);
  if (type === 'visualization') {
    yield put(initializeChartWidgetAction(id));
  } else {
    yield put(
      setWidgetState(id, {
        isConfigured: true,
        isInitialized: true,
      })
    );
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
  const action = yield take([CLOSE_CHART_EDITOR, APPLY_CONFIGURATION]);

  if (action.type === CLOSE_CHART_EDITOR) {
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
    yield take(EDITOR_UNMOUNTED);
    yield put(resetEditor());

    yield put(initializeChartWidgetAction(widgetId));

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
    yield put(updateAccessKeyOptions());

    const dashboardId = yield select(getActiveDashboard);
    yield put(saveDashboard(dashboardId));
  }
}

export function* createWidget({
  payload,
}: ReturnType<typeof createWidgetAction>) {
  const { id, widgetType } = payload;
  if (widgetType === 'image') {
    yield fork(selectImageWidget, id);
  } else if (widgetType === 'date-picker') {
    yield fork(setupDatePicker, id);
  } else if (widgetType === 'text') {
    yield fork(createTextWidget, id);
    yield take(ADD_WIDGET_TO_DASHBOARD);
    const dashboardId = yield select(getActiveDashboard);
    yield put(saveDashboard(dashboardId));
  } else if (widgetType === 'filter') {
    yield fork(setupFilterWidget, id);
  } else {
    yield fork(selectQueryForWidget, id);
  }
}

export function* cloneWidget({
  payload,
}: ReturnType<typeof cloneWidgetAction>) {
  const { widgetId } = payload;
  const clonedWidgetId = createWidgetId();
  const widgetItem: WidgetItem = yield select(getWidget, widgetId);

  const {
    widget: { type },
  } = widgetItem;
  let widgetSettings = widgetItem.widget;

  if (type === 'visualization') {
    widgetSettings = {
      ...widgetSettings,
      datePickerId: null,
    } as ChartWidget;
  }

  yield put(
    saveClonedWidget(clonedWidgetId, widgetSettings, widgetItem as WidgetItem)
  );
  const dashboardId = yield select(getActiveDashboard);
  yield put(addWidgetToDashboard(dashboardId, clonedWidgetId));
  yield put(saveDashboard(dashboardId));
}

export function* widgetsSaga() {
  yield takeLatest(SAVED_QUERY_UPDATED, reinitializeWidgets);
  yield takeLatest(CREATE_WIDGET, createWidget);
  yield takeLatest(EDIT_CHART_WIDGET, editChartWidget);
  yield takeLatest(EDIT_IMAGE_WIDGET, editImageWidget);
  yield takeLatest(EDIT_TEXT_WIDGET, editTextWidget);
  yield takeLatest(EDIT_DATE_PICKER_WIDGET, editDatePickerWidget);
  yield takeLatest(SET_DATE_PICKER_WIDGET_MODIFIERS, setDatePickerModifiers);
  yield takeLatest(APPLY_DATE_PICKER_MODIFIERS, applyDatePickerModifiers);
  yield takeLatest(EDIT_INLINE_TEXT_WIDGET, editInlineTextWidget);
  yield takeLatest(CLONE_WIDGET, cloneWidget);
  yield takeLatest(CLEAR_DATE_PICKER_MODIFIERS, clearDatePickerModifiers);
  yield takeEvery(RESET_DATE_PICKER_WIDGETS, resetDatePickerWidgets);
  yield takeEvery(INITIALIZE_WIDGET, initializeWidget);
  yield takeEvery(INITIALIZE_CHART_WIDGET, initializeChartWidget);
}
