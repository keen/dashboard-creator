import { put, all, call, select, take } from 'redux-saga/effects';
import { getWidget, getWidgetSettings } from '../selectors';

import {
  DatePickerConnection,
  datePickerActions,
  datePickerSelectors,
} from '../../datePicker';

import { ChartWidget, DatePickerWidget } from '../types';
import { appSelectors } from '../../app';
import { widgetsActions } from '../index';
import { dashboardsActions, dashboardsSelectors } from '../../dashboards';

/**
 * Apply date picker connections updates to connected widgets
 *
 * @param datePickerWidgetId - Datepicker widget identifer
 * @return void
 *
 */
export function* applyDatePickerModifiers({
  payload,
}: ReturnType<typeof widgetsActions.applyDatePickerModifiers>) {
  const { id } = payload;

  yield put(
    widgetsActions.setWidgetState({ id: id, widgetState: { isActive: true } })
  );
  const {
    settings: { widgets },
  } = yield select(getWidgetSettings, id);

  yield all(
    widgets.map((widgetId: string) =>
      put(
        widgetsActions.setWidgetState({
          id: widgetId,
          widgetState: { isInitialized: false, error: null },
        })
      )
    )
  );
  yield all(
    widgets.map((widgetId: string) =>
      put(widgetsActions.initializeChartWidget(widgetId))
    )
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
}: ReturnType<typeof widgetsActions.setDatePickerModifiers>) {
  const { widgetId, timezone, timeframe } = payload;
  const widgetState = {
    data: {
      timezone,
      timeframe,
    },
  };
  yield put(widgetsActions.setWidgetState({ id: widgetId, widgetState }));
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
  } = dashboardsSelectors.getDashboard(state, dashboardId);

  const widgetsWithoutErrors = widgetsIds
    .map((widgetId) => getWidget(state, widgetId))
    .filter((widget) => !widget.error)
    .map((widget) => widget.widget);

  const widgets: DatePickerConnection[] = widgetsWithoutErrors
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
  } = dashboardsSelectors.getDashboard(state, dashboardId);

  const connections = widgetsIds
    .map((widgetId) => getWidgetSettings(state, widgetId))
    .filter(
      ({ type, datePickerId }: ChartWidget) =>
        type === 'visualization' && datePickerId === widgetId
    )
    .map(({ id }) => id);

  const chartWidgetsUpdates = connections.map((chartWidgetId) =>
    put(
      widgetsActions.updateChartWidgetDatePickerConnections({
        id: chartWidgetId,
        datePickerId: null,
      })
    )
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
  const { name } = yield select(datePickerSelectors.getDatePickerSettings);
  const updatedConnections = widgets.filter((id: string) => id !== widgetId);
  yield put(
    widgetsActions.setDatePickerWidget({
      id: datePickerId,
      widgetConnections: updatedConnections,
      name,
    })
  );
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
    name,
  }: { widgetConnections: DatePickerConnection[]; name: string } = yield select(
    datePickerSelectors.getDatePickerSettings
  );

  const widgetPickerConnections = updatedConnections
    .filter(({ isConnected }) => isConnected)
    .map(({ widgetId }) => widgetId);

  const chartWidgetsUpdates = updatedConnections.map(
    ({ widgetId, isConnected }) => {
      const datePickerId = isConnected ? datePickerWidgetId : null;
      return put(
        widgetsActions.updateChartWidgetDatePickerConnections({
          id: widgetId,
          datePickerId,
        })
      );
    }
  );

  yield all(chartWidgetsUpdates);
  yield put(
    widgetsActions.setDatePickerWidget({
      id: datePickerWidgetId,
      widgetConnections: widgetPickerConnections,
      name,
    })
  );
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
}: ReturnType<typeof widgetsActions.editDatePickerWidget>) {
  const { id: datePickerWidgetId } = payload;

  const dashboardId = yield select(appSelectors.getActiveDashboard);
  const widgetConnections = yield call(
    getDatePickerWidgetConnections,
    dashboardId,
    datePickerWidgetId
  );

  const {
    settings: { name },
  }: DatePickerWidget = yield select(getWidgetSettings, datePickerWidgetId);

  yield put(datePickerActions.setEditorConnections({ widgetConnections }));

  const {
    settings: { widgets: dashboardWidgetsIds },
  } = yield select(dashboardsSelectors.getDashboard, dashboardId);
  const widgetsConnectionsPool = widgetConnections.map(
    ({ widgetId }) => widgetId
  );

  const fadeOutWidgets = dashboardWidgetsIds
    .filter(
      (id: string) =>
        !widgetsConnectionsPool.includes(id) && id !== datePickerWidgetId
    )
    .map((id: string) =>
      put(
        widgetsActions.setWidgetState({ id, widgetState: { isFadeOut: true } })
      )
    );

  const titleCoverWidgets = widgetConnections
    .filter(({ title }) => !title)
    .map(({ widgetId }) =>
      put(
        widgetsActions.setWidgetState({
          id: widgetId,
          widgetState: { isTitleCover: true },
        })
      )
    );

  const highlightWidgets = widgetConnections
    .filter(({ isConnected }) => isConnected)
    .map(({ widgetId }) =>
      put(
        widgetsActions.setWidgetState({
          id: widgetId,
          widgetState: { isHighlighted: true },
        })
      )
    );

  yield all([...fadeOutWidgets, ...titleCoverWidgets, ...highlightWidgets]);
  yield put(datePickerActions.setName({ name }));
  yield put(datePickerActions.openEditor());

  const action = yield take([
    datePickerActions.applySettings.type,
    datePickerActions.closeEditor.type,
  ]);

  yield all(
    dashboardWidgetsIds.map((widgetId: string) =>
      put(
        widgetsActions.setWidgetState({
          id: widgetId,
          widgetState: {
            isHighlighted: false,
            isFadeOut: false,
            isTitleCover: false,
          },
        })
      )
    )
  );

  if (action.type === datePickerActions.applySettings.type) {
    yield call(applyDatePickerUpdates, datePickerWidgetId);

    yield put(datePickerActions.closeEditor());
    yield put(dashboardsActions.saveDashboard(dashboardId));
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

  yield take(dashboardsActions.addWidgetToDashboard.type);

  const {
    settings: { widgets: dashboardWidgetsIds },
  } = yield select(dashboardsSelectors.getDashboard, dashboardId);

  const widgetConnections = yield call(
    getDatePickerWidgetConnections,
    dashboardId,
    datePickerWidgetId,
    true
  );

  const widgetsConnectionsPool = widgetConnections.map(
    ({ widgetId }) => widgetId
  );

  yield put(datePickerActions.setEditorConnections({ widgetConnections }));
  yield put(datePickerActions.openEditor());

  const fadeOutWidgets = dashboardWidgetsIds
    .filter(
      (id: string) =>
        !widgetsConnectionsPool.includes(id) && id !== datePickerWidgetId
    )
    .map((id: string) =>
      put(
        widgetsActions.setWidgetState({ id, widgetState: { isFadeOut: true } })
      )
    );

  const titleCoverWidgets = widgetConnections
    .filter(({ title }) => !title)
    .map(({ widgetId }) =>
      put(
        widgetsActions.setWidgetState({
          id: widgetId,
          widgetState: { isTitleCover: true },
        })
      )
    );

  const highlightWidgets = widgetConnections
    .filter(({ isConnected }) => isConnected)
    .map(({ widgetId }) =>
      put(
        widgetsActions.setWidgetState({
          id: widgetId,
          widgetState: { isHighlighted: true },
        })
      )
    );

  yield all([...fadeOutWidgets, ...titleCoverWidgets, ...highlightWidgets]);

  const action = yield take([
    datePickerActions.applySettings.type,
    datePickerActions.closeEditor.type,
  ]);

  yield all(
    dashboardWidgetsIds.map((widgetId: string) =>
      put(
        widgetsActions.setWidgetState({
          id: widgetId,
          widgetState: {
            isHighlighted: false,
            isFadeOut: false,
            isTitleCover: false,
          },
        })
      )
    )
  );

  if (action.type === datePickerActions.applySettings.type) {
    yield call(applyDatePickerUpdates, datePickerWidgetId);

    yield put(datePickerActions.closeEditor());
    yield put(dashboardsActions.saveDashboard(dashboardId));
  } else {
    yield put(
      dashboardsActions.removeWidgetFromDashboard({ dashboardId, widgetId })
    );
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
}: ReturnType<typeof widgetsActions.resetDatePickerWidgets>) {
  const { dashboardId } = payload;
  const state = yield select();
  const dashboard = dashboardsSelectors.getDashboard(state, dashboardId);

  if (dashboard) {
    const {
      settings: { widgets: widgetsIds },
    } = dashboard;

    const datePickersUpdate = widgetsIds
      .map((widgetId) => getWidgetSettings(state, widgetId))
      .filter(({ type }) => type === 'date-picker')
      .map(({ id }) =>
        put(
          widgetsActions.setWidgetState({
            id,
            widgetState: { isActive: false, data: null },
          })
        )
      );

    yield all(datePickersUpdate);
  }
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
}: ReturnType<typeof widgetsActions.clearDatePickerModifiers>) {
  const { id } = payload;

  yield put(
    widgetsActions.setWidgetState({
      id,
      widgetState: { isActive: false, data: null },
    })
  );
  const {
    settings: { widgets },
  } = yield select(getWidgetSettings, id);

  yield all(
    widgets.map((widgetId: string) =>
      put(
        widgetsActions.setWidgetState({
          id: widgetId,
          widgetState: { isInitialized: false, error: null },
        })
      )
    )
  );
  yield all(
    widgets.map((widgetId: string) =>
      put(widgetsActions.initializeChartWidget(widgetId))
    )
  );
}
