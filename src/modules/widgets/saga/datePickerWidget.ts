import { put, all, call, select, take } from 'redux-saga/effects';

import {
  editDatePickerWidget as editDatePickerWidgetAction,
  setDatePickerModifiers as setDatePickerModifiersAction,
  applyDatePickerModifiers as applyDatePickerModifiersAction,
  resetDatePickerWidgets as resetDatePickerWidgetsAction,
  clearDatePickerModifiers as clearDatePickerModifiersAction,
  setDatePickerWidget,
  updateChartWidgetDatePickerConnection,
  setWidgetState,
  initializeChartWidget,
} from '../actions';
import { getWidgetSettings } from '../selectors';

import {
  openEditor,
  closeEditor,
  getDatePickerSettings,
  setEditorConnections,
  APPLY_EDITOR_SETTINGS,
  CLOSE_EDITOR,
  DatePickerConnection,
} from '../../datePicker';

import {
  getDashboard,
  saveDashboard,
  removeWidgetFromDashboard,
  ADD_WIDGET_TO_DASHBOARD,
} from '../../dashboards';

import { ChartWidget } from '../types';
import { appSelectors } from '../../app';

/**
 * Apply date picker connections updates to connected widgets
 *
 * @param datePickerWidgetId - Datepicker widget identifer
 * @return void
 *
 */
export function* applyDatePickerModifiers({
  payload,
}: ReturnType<typeof applyDatePickerModifiersAction>) {
  const { id } = payload;

  yield put(setWidgetState(id, { isActive: true }));
  const {
    settings: { widgets },
  } = yield select(getWidgetSettings, id);

  yield all(
    widgets.map((widgetId: string) =>
      put(setWidgetState(widgetId, { isInitialized: false, error: null }))
    )
  );
  yield all(
    widgets.map((widgetId: string) => put(initializeChartWidget(widgetId)))
  );
}

/**
 * Set temporary modifiers settings for date picker
 *
 * @param widgetId - Widget identifer
 * @param timezone - Timezone settings
 * @param timeframe - timeframe settings
 * @return void
 *
 */
export function* setDatePickerModifiers({
  payload,
}: ReturnType<typeof setDatePickerModifiersAction>) {
  const { widgetId, timezone, timeframe } = payload;
  const widgetState = {
    data: {
      timezone,
      timeframe,
    },
  };
  yield put(setWidgetState(widgetId, widgetState));
}

/**
 * Get possible data picker widget connections.
 *
 * @param dashboardId - Dashboard identifer
 * @param widgetId - Widget identifer
 * @param connectByDefault - Connects all widgets by default
 * @return void
 *
 */
export function* getDatePickerWidgetConnections(
  dashboardId: string,
  widgetId: string,
  connectByDefault?: boolean
) {
  const state = yield select();
  const {
    settings: { widgets: widgetsIds },
  } = getDashboard(state, dashboardId);

  const widgets: DatePickerConnection[] = widgetsIds
    .map((widgetId) => getWidgetSettings(state, widgetId))
    .sort((widgetA, widgetB) => widgetA.position.y - widgetB.position.y)
    .filter(
      ({ type, datePickerId }: ChartWidget) =>
        type === 'visualization' && (datePickerId === widgetId || !datePickerId)
    )
    .map(({ id, datePickerId, settings: { widgetSettings } }: ChartWidget) => ({
      widgetId: id,
      isConnected: connectByDefault ? true : !!datePickerId,
      title: 'title' in widgetSettings ? widgetSettings.title.content : null,
      positionIndex: widgetsIds.indexOf(id) + 1,
    }));

  return widgets;
}

/**
 * Release connections after date picker widget is removed.
 *
 * @param widgetId - Widget identifer
 * @return void
 *
 */
export function* removeDatePickerConnections(
  dashboardId: string,
  widgetId: string
) {
  const state = yield select();
  const {
    settings: { widgets: widgetsIds },
  } = getDashboard(state, dashboardId);

  const connections = widgetsIds
    .map((widgetId) => getWidgetSettings(state, widgetId))
    .filter(
      ({ type, datePickerId }: ChartWidget) =>
        type === 'visualization' && datePickerId === widgetId
    )
    .map(({ id }) => id);

  const chartWidgetsUpdates = connections.map((chartWidgetId) =>
    put(updateChartWidgetDatePickerConnection(chartWidgetId, null))
  );

  yield all(chartWidgetsUpdates);
}

/**
 * Release connection from date picker after chart widget is removed.
 *
 * @param datePickerId - Date picker identifer
 * @param widgetId - Widget identifer
 * @return void
 *
 */
export function* removeConnectionFromDatePicker(
  datePickerId: string,
  widgetId: string
) {
  const {
    settings: { widgets },
  } = yield select(getWidgetSettings, datePickerId);

  const updatedConnections = widgets.filter((id: string) => id !== widgetId);
  yield put(setDatePickerWidget(datePickerId, updatedConnections));
}

/**
 * Apply date picker connections updates to connected widgets
 *
 * @param datePickerWidgetId - Datepicker widget identifer
 * @return void
 *
 */
export function* applyDatePickerUpdates(datePickerWidgetId: string) {
  const {
    widgetConnections: updatedConnections,
  }: { widgetConnections: DatePickerConnection[] } = yield select(
    getDatePickerSettings
  );

  const widgetPickerConnections = updatedConnections
    .filter(({ isConnected }) => isConnected)
    .map(({ widgetId }) => widgetId);

  const chartWidgetsUpdates = updatedConnections.map(
    ({ widgetId, isConnected }) => {
      const datePickerId = isConnected ? datePickerWidgetId : null;
      return put(updateChartWidgetDatePickerConnection(widgetId, datePickerId));
    }
  );

  yield all(chartWidgetsUpdates);
  yield put(setDatePickerWidget(datePickerWidgetId, widgetPickerConnections));
}

/**
 * Flow responsible for editing date picker widget.
 *
 * @param widgetId - Widget identifer
 * @return void
 *
 */
export function* editDatePickerWidget({
  payload,
}: ReturnType<typeof editDatePickerWidgetAction>) {
  const { id: datePickerWidgetId } = payload;

  const dashboardId = yield select(appSelectors.getActiveDashboard);
  const widgetConnections = yield call(
    getDatePickerWidgetConnections,
    dashboardId,
    datePickerWidgetId
  );

  yield put(setEditorConnections(widgetConnections));

  const {
    settings: { widgets: dashboardWidgetsIds },
  } = yield select(getDashboard, dashboardId);
  const widgetsConnectionsPool = widgetConnections.map(
    ({ widgetId }) => widgetId
  );

  const fadeOutWidgets = dashboardWidgetsIds
    .filter(
      (id: string) =>
        !widgetsConnectionsPool.includes(id) && id !== datePickerWidgetId
    )
    .map((id: string) => put(setWidgetState(id, { isFadeOut: true })));

  const titleCoverWidgets = widgetConnections
    .filter(({ title }) => !title)
    .map(({ widgetId }) =>
      put(setWidgetState(widgetId, { isTitleCover: true }))
    );

  const highlightWidgets = widgetConnections
    .filter(({ isConnected }) => isConnected)
    .map(({ widgetId }) =>
      put(setWidgetState(widgetId, { isHighlighted: true }))
    );

  yield all([...fadeOutWidgets, ...titleCoverWidgets, ...highlightWidgets]);
  yield put(openEditor());

  const action = yield take([APPLY_EDITOR_SETTINGS, CLOSE_EDITOR]);

  yield all(
    dashboardWidgetsIds.map((widgetId: string) =>
      put(
        setWidgetState(widgetId, {
          isHighlighted: false,
          isFadeOut: false,
          isTitleCover: false,
        })
      )
    )
  );

  if (action.type === APPLY_EDITOR_SETTINGS) {
    yield call(applyDatePickerUpdates, datePickerWidgetId);

    yield put(closeEditor());
    yield put(saveDashboard(dashboardId));
  }
}

/**
 * Flow responsible for setup date picker widget.
 *
 * @param widgetId - Widget identifer
 * @return void
 *
 */
export function* setupDatePicker(widgetId: string) {
  const datePickerWidgetId = widgetId;
  const dashboardId = yield select(appSelectors.getActiveDashboard);

  yield take(ADD_WIDGET_TO_DASHBOARD);
  const {
    settings: { widgets: dashboardWidgetsIds },
  } = yield select(getDashboard, dashboardId);

  const widgetConnections = yield call(
    getDatePickerWidgetConnections,
    dashboardId,
    datePickerWidgetId,
    true
  );

  const widgetsConnectionsPool = widgetConnections.map(
    ({ widgetId }) => widgetId
  );

  yield put(setEditorConnections(widgetConnections));
  yield put(openEditor());

  const fadeOutWidgets = dashboardWidgetsIds
    .filter(
      (id: string) =>
        !widgetsConnectionsPool.includes(id) && id !== datePickerWidgetId
    )
    .map((id: string) => put(setWidgetState(id, { isFadeOut: true })));

  const titleCoverWidgets = widgetConnections
    .filter(({ title }) => !title)
    .map(({ widgetId }) =>
      put(setWidgetState(widgetId, { isTitleCover: true }))
    );

  const highlightWidgets = widgetConnections
    .filter(({ isConnected }) => isConnected)
    .map(({ widgetId }) =>
      put(setWidgetState(widgetId, { isHighlighted: true }))
    );

  yield all([...fadeOutWidgets, ...titleCoverWidgets, ...highlightWidgets]);

  const action = yield take([APPLY_EDITOR_SETTINGS, CLOSE_EDITOR]);

  yield all(
    dashboardWidgetsIds.map((widgetId: string) =>
      put(
        setWidgetState(widgetId, {
          isHighlighted: false,
          isFadeOut: false,
          isTitleCover: false,
        })
      )
    )
  );

  if (action.type === APPLY_EDITOR_SETTINGS) {
    yield call(applyDatePickerUpdates, datePickerWidgetId);

    yield put(closeEditor());
    yield put(saveDashboard(dashboardId));
  } else {
    yield put(removeWidgetFromDashboard(dashboardId, widgetId));
  }
}

/**
 * Reset date pickers to initial state for specified dashboard
 *
 * @param dashboardId - Dashboard identifer
 * @return void
 *
 */
export function* resetDatePickerWidgets({
  payload,
}: ReturnType<typeof resetDatePickerWidgetsAction>) {
  const { dashboardId } = payload;
  const state = yield select();
  const {
    settings: { widgets: widgetsIds },
  } = getDashboard(state, dashboardId);

  const datePickersUpdate = widgetsIds
    .map((widgetId) => getWidgetSettings(state, widgetId))
    .filter(({ type }) => type === 'date-picker')
    .map(({ id }) => put(setWidgetState(id, { isActive: false, data: null })));

  yield all(datePickersUpdate);
}

/**
 * Reset date pickers to initial state and update connected widgets
 *
 * @param dashboardId - Dashboard identifer
 * @return void
 *
 */
export function* clearDatePickerModifiers({
  payload,
}: ReturnType<typeof clearDatePickerModifiersAction>) {
  const { id } = payload;

  yield put(setWidgetState(id, { isActive: false, data: null }));
  const {
    settings: { widgets },
  } = yield select(getWidgetSettings, id);

  yield all(
    widgets.map((widgetId: string) =>
      put(setWidgetState(widgetId, { isInitialized: false, error: null }))
    )
  );
  yield all(
    widgets.map((widgetId: string) => put(initializeChartWidget(widgetId)))
  );
}
