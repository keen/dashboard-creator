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
  clearInconsistentFiltersError as clearInconsistentFiltersErrorAction,
  createNewChart as createNewChartAction,
} from './actions';

import { getWidgetSettings, getWidget } from './selectors';

import {
  removeWidgetFromDashboard,
  saveDashboard,
  getDashboardSettings,
  updateAccessKeyOptions,
  addWidgetToDashboard,
  ADD_WIDGET_TO_DASHBOARD,
  getDashboard,
} from '../dashboards';

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

import { editChartWidget } from './saga/chartWidget';
import {
  setFilterWidget,
  editFilterWidget,
  setupFilterWidget,
  applyFilterModifiers,
  unapplyFilterWidget,
  resetFilterWidgets,
} from './saga/filterWidget';
import { initializeChartWidget } from './saga/chart';

import { SELECT_SAVED_QUERY, CREATE_QUERY, SavedQuery } from '../queries';
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
  EDIT_FILTER_WIDGET,
  CLONE_WIDGET,
  SET_FILTER_WIDGET,
  APPLY_FILTER_MODIFIERS,
  CLEAR_INCONSISTENT_FILTERS_ERROR_FROM_WIDGETS,
  UNAPPLY_FILTER_WIDGET,
  RESET_FILTER_WIDGETS,
  CREATE_NEW_CHART,
} from './constants';

import { ChartWidget, WidgetErrors, WidgetItem } from './types';
import { findBiggestYPositionOfWidgets } from '../dashboards/utils/findBiggestYPositionOfWidgets';
import { appActions, appSelectors } from '../app';
import { chartEditorActions, chartEditorSelectors } from '../chartEditor';

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
  const dashboardId = yield select(appSelectors.getActiveDashboard);

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

export function* clearInconsistentFiltersErrorFromWidgets({
  payload,
}: ReturnType<typeof clearInconsistentFiltersErrorAction>) {
  const { widgets: widgetIds } = yield select(
    getDashboardSettings,
    payload.dashboardId
  );
  const widgets = yield all(
    widgetIds.map((id: string) => select(getWidget, id))
  );
  const widgetsWithInconsistentFilterError = widgets.filter(
    (widget) =>
      widget.error && widget.error.code === WidgetErrors.INCONSISTENT_FILTER
  );
  yield all(
    widgetsWithInconsistentFilterError.map((widget) =>
      put(setWidgetState(widget.widget.id, { error: null }))
    )
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
  const dashboardId = yield select(appSelectors.getActiveDashboard);
  yield put(removeWidgetFromDashboard(dashboardId, widgetId));
}

/**
 * Flow responsible for creating ad-hoc query for chart widget.
 *
 * @param widgetId - Widget identifer
 * @return void
 *
 */
export function* createQueryForWidget(
  widgetId: string,
  isExistingWidget = false
) {
  yield put(chartEditorActions.openEditor());
  const action = yield take([
    chartEditorActions.closeEditor.type,
    chartEditorActions.applyConfiguration.type,
  ]);

  if (action.type === chartEditorActions.closeEditor.type) {
    if (isExistingWidget) {
      yield put(chartEditorActions.closeEditor());
    } else {
      yield* cancelWidgetConfiguration(widgetId);
    }
    yield take(chartEditorActions.editorUnmounted.type);
    yield put(chartEditorActions.resetEditor());
  } else {
    const {
      querySettings,
      visualization: { type, chartSettings, widgetSettings },
    } = yield select(chartEditorSelectors.getChartEditor);

    yield put(
      finishChartWidgetConfiguration(
        widgetId,
        querySettings,
        type,
        chartSettings,
        widgetSettings
      )
    );

    yield put(chartEditorActions.closeEditor());
    yield take(chartEditorActions.editorUnmounted.type);
    yield put(chartEditorActions.resetEditor());

    if (isExistingWidget) {
      yield put(
        setWidgetState(widgetId, { isInitialized: false, error: null })
      );
    }

    yield put(initializeChartWidgetAction(widgetId));

    const dashboardId = yield select(appSelectors.getActiveDashboard);
    yield put(saveDashboard(dashboardId));
  }
}

export function* selectSavedQueryForWidget(
  query: SavedQuery,
  widgetId: string,
  isExistingWidget = false
) {
  const {
    id: queryId,
    visualization: { type: widgetType, chartSettings, widgetSettings },
  } = query;

  yield put(
    finishChartWidgetConfiguration(
      widgetId,
      queryId,
      widgetType,
      chartSettings,
      widgetSettings
    )
  );

  if (isExistingWidget) {
    yield put(setWidgetState(widgetId, { isInitialized: false, error: null }));
  }

  yield put(initializeChartWidgetAction(widgetId));
  yield put(updateAccessKeyOptions());

  const dashboardId = yield select(appSelectors.getActiveDashboard);
  yield put(saveDashboard(dashboardId));
}

/**
 * Initial flow for creating chart widget.
 *
 * @param widgetId - Widget identifer
 * @return void
 *
 */
export function* selectQueryForWidget(widgetId: string) {
  yield put(appActions.showQueryPicker());
  const action = yield take([
    SELECT_SAVED_QUERY,
    CREATE_QUERY,
    appActions.hideQueryPicker.type,
  ]);

  if (action.type === appActions.hideQueryPicker.type) {
    yield* cancelWidgetConfiguration(widgetId);
  } else if (action.type === CREATE_QUERY) {
    yield put(appActions.hideQueryPicker());
    yield call(createQueryForWidget, widgetId);
  } else if (action.type === SELECT_SAVED_QUERY) {
    yield put(appActions.hideQueryPicker());
    yield call(selectSavedQueryForWidget, action.payload.query, widgetId);
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
    const dashboardId = yield select(appSelectors.getActiveDashboard);
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
  const dashboardId = yield select(appSelectors.getActiveDashboard);
  const dashboard = yield select(getDashboard, dashboardId);

  const widgets = yield all(
    dashboard.settings.widgets.map((id: string) => select(getWidget, id))
  );

  const {
    widget: { type },
  } = widgetItem;

  let widgetSettings = {
    ...widgetItem.widget,
    position: {
      ...widgetItem.widget.position,
      y: findBiggestYPositionOfWidgets(widgets) + 1,
    },
  };

  if (type === 'visualization') {
    widgetSettings = {
      ...widgetSettings,
      datePickerId: null,
    } as ChartWidget;
  }

  yield put(
    saveClonedWidget(clonedWidgetId, widgetSettings, widgetItem as WidgetItem)
  );
  yield put(addWidgetToDashboard(dashboardId, clonedWidgetId));
  yield put(saveDashboard(dashboardId));
}

export function* createNewChart({
  payload,
}: ReturnType<typeof createNewChartAction>) {
  const { widgetId } = payload;

  yield put(appActions.showQueryPicker());
  const action = yield take([
    SELECT_SAVED_QUERY,
    CREATE_QUERY,
    appActions.hideQueryPicker.type,
  ]);

  if (action.type === appActions.hideQueryPicker.type) {
    yield put(appActions.hideQueryPicker());
  } else if (action.type === CREATE_QUERY) {
    yield put(appActions.hideQueryPicker());
    yield call(createQueryForWidget, widgetId, true);
  } else if (action.type === SELECT_SAVED_QUERY) {
    yield put(appActions.hideQueryPicker());
    yield call(selectSavedQueryForWidget, action.payload.query, widgetId, true);
  }
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
  yield takeLatest(EDIT_FILTER_WIDGET, editFilterWidget);
  yield takeLatest(CREATE_NEW_CHART, createNewChart);
  yield takeEvery(RESET_DATE_PICKER_WIDGETS, resetDatePickerWidgets);
  yield takeEvery(INITIALIZE_WIDGET, initializeWidget);
  yield takeEvery(INITIALIZE_CHART_WIDGET, initializeChartWidget);
  yield takeEvery(SET_FILTER_WIDGET, setFilterWidget);
  yield takeEvery(APPLY_FILTER_MODIFIERS, applyFilterModifiers);
  yield takeEvery(
    CLEAR_INCONSISTENT_FILTERS_ERROR_FROM_WIDGETS,
    clearInconsistentFiltersErrorFromWidgets
  );
  yield takeEvery(RESET_FILTER_WIDGETS, resetFilterWidgets);
  yield takeEvery(UNAPPLY_FILTER_WIDGET, unapplyFilterWidget);
}
