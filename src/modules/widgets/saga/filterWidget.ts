/* eslint-disable @typescript-eslint/naming-convention */
import {
  all,
  call,
  put,
  select,
  take,
  cancel,
  fork,
  cancelled,
  getContext,
} from 'redux-saga/effects';
import {
  ADD_WIDGET_TO_DASHBOARD,
  getDashboard,
  saveDashboard,
  removeWidgetFromDashboard,
} from '../../dashboards';
import { getWidget, getWidgetSettings } from '../selectors';

import { FilterConnection, ReducerState } from '../../filter/types';
import { ChartWidget, FilterWidget } from '../types';

import {
  openEditor,
  closeEditor,
  resetEditor,
  setEditorConnections,
  setEditorDetachedConnections,
  setEventStream,
  setTargetProperty,
  setupDashboardEventStreams,
  getFilterWidgetConnections,
  getDetachedFilterWidgetConnections,
  SET_EVENT_STREAM,
  APPLY_EDITOR_SETTINGS,
  CLOSE_EDITOR,
  getFilterSettings,
  setName,
} from '../../filter';

import {
  editFilterWidget as editFilterWidgetAction,
  configureFilerWidget,
  setWidgetState,
  updateChartWidgetFiltersConnections,
  setFilterWidget as setFilterWidgetAction,
  setFilterPropertyList,
  initializeChartWidget,
  applyFilterModifiers as applyFilterModifiersAction,
  unapplyFilterWidget as unapplyFilterWidgetAction,
  resetFilterWidgets as resetFilterWidgetsAction,
} from '../actions';
import { KEEN_ANALYSIS } from '../../../constants';

import { getOldestTimeframe } from '../../../utils/getOldestTimeframe';
import { appSelectors } from '../../app';

/**
 * Apply filter connections updates to connected widgets
 *
 * @param filterId - filter widget identifer
 * @return void
 *
 */
export function* applyFilterModifiers({
  payload,
}: ReturnType<typeof applyFilterModifiersAction>) {
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
 * Set filter widget settings
 *
 * @param widgetId - Widget identifier
 * @return void
 *
 */
export function* setFilterWidget({
  payload,
}: ReturnType<typeof setFilterWidgetAction>) {
  const filter = yield select(getWidget, payload.widgetId);
  const { widgets, eventStream, targetProperty } = filter.widget.settings;
  const connectedWidgets = yield all(
    widgets.map((id: string) => select(getWidget, id))
  );

  const connectedWidgetsTimeframes = connectedWidgets
    .filter(
      (connectedWidget: Record<string, any>) =>
        connectedWidget.data && connectedWidget.data.query
    )
    .map(
      (connectedWidget: Record<string, any>) =>
        connectedWidget.data.query.timeframe
    );

  const client = yield getContext(KEEN_ANALYSIS);

  yield put(
    setWidgetState(payload.widgetId, {
      isLoading: true,
    })
  );

  try {
    const response = yield client.query({
      analysisType: 'select_unique',
      eventCollection: eventStream,
      targetProperty: targetProperty,
      timeframe: getOldestTimeframe(connectedWidgetsTimeframes),
      filters: [
        {
          property_name: targetProperty,
          operator: 'exists',
          property_value: true,
        },
        {
          property_name: targetProperty,
          operator: 'ne',
          property_value: null,
        },
      ],
    });
    const filterItemsSortedAlphabetically = response.result.sort((a, b) =>
      a.localeCompare(b)
    );
    yield put(
      setFilterPropertyList(filter.widget.id, filterItemsSortedAlphabetically)
    );
  } catch (err) {
    yield put(
      setWidgetState(payload.widgetId, {
        error: err,
      })
    );
  } finally {
    yield put(
      setWidgetState(payload.widgetId, {
        isLoading: false,
      })
    );
  }
}

/**
 * Release connection from filter after chart widget is removed.
 *
 * @param filterId - Filter identifier
 * @param widgetId - Widget identifier
 * @return void
 *
 */
export function* removeConnectionFromFilter(
  filterId: string,
  widgetId: string
) {
  const {
    settings: { widgets, eventStream, targetProperty },
  } = yield select(getWidgetSettings, filterId);

  const updatedConnections = widgets.filter((id: string) => id !== widgetId);
  yield put(
    configureFilerWidget(
      filterId,
      updatedConnections,
      eventStream,
      targetProperty
    )
  );
}

/**
 * Release connections after filter widget is removed.
 *
 * @param deletedFilterId - Widget identifer
 * @return void
 *
 */
export function* removeFilterConnections(
  dashboardId: string,
  deletedFilterId: string
) {
  const state = yield select();
  const {
    settings: { widgets: widgetsIds },
  } = getDashboard(state, dashboardId);

  const connections = widgetsIds
    .map((widgetId) => getWidgetSettings(state, widgetId))
    .filter(
      ({ type, filterIds }: ChartWidget) =>
        type === 'visualization' && filterIds.includes(deletedFilterId)
    );
  const chartWidgetsUpdates = connections.map((chart: ChartWidget) =>
    put(
      updateChartWidgetFiltersConnections(
        chart.id,
        chart.filterIds.filter((id) => id !== deletedFilterId)
      )
    )
  );

  yield all(chartWidgetsUpdates);
}

/**
 * Apply filter connections updates to connected widgets
 *
 * @param filterWidgetId - Filter widget identifer
 * @return void
 *
 */
export function* applyFilterUpdates(filterWidgetId: string) {
  const {
    widgetConnections: updatedConnections,
    eventStream,
    targetProperty,
    name,
  }: ReducerState = yield select(getFilterSettings);

  const connectedCharts = updatedConnections
    .filter(({ isConnected }) => isConnected)
    .map(({ widgetId }) => widgetId);

  const state = yield select();
  const availableCharts = updatedConnections.map((connection) =>
    getWidget(state, connection.widgetId)
  );

  const chartsWidgetUpdates = availableCharts.map(({ widget }) => {
    const { id, filterIds } = widget as ChartWidget;

    const chartFilterIds = new Set<string>(filterIds);
    if (connectedCharts.includes(id)) {
      chartFilterIds.add(filterWidgetId);
    } else {
      chartFilterIds.delete(filterWidgetId);
    }
    return put(updateChartWidgetFiltersConnections(id, [...chartFilterIds]));
  });

  yield all(chartsWidgetUpdates);
  yield put(
    configureFilerWidget(
      filterWidgetId,
      connectedCharts,
      eventStream,
      targetProperty,
      name
    )
  );
}

/**
 * Highlights and fade outs widgets based on connections state
 *
 * @param dashboardId - Dashboard identifer
 * @param filterWidgetId - Filter widget identifier
 * @param widgetConnections - Connections between widgets
 * @return void
 *
 */
export function* updateWidgetsDistinction(
  dashboardId: string,
  filterWidgetId: string,
  widgetConnections: FilterConnection[]
) {
  const state = yield select();
  const {
    settings: { widgets: dashboardWidgetsIds },
  } = getDashboard(state, dashboardId);

  const { detachedWidgetConnections } = getFilterSettings(state);

  const widgetConnectionIds = widgetConnections.map(({ widgetId }) => widgetId);
  const detachedConnectionsIds = detachedWidgetConnections.map(
    ({ widgetId }) => widgetId
  );

  const dashboardWidgets = dashboardWidgetsIds.map((widgetId) =>
    getWidget(state, widgetId)
  );

  const fadeOutWidgets = dashboardWidgetsIds
    .map((widgetId) => getWidget(state, widgetId))
    .filter(({ widget: { id, type } }) => {
      if (filterWidgetId === id) return false;
      return type !== 'visualization';
    })
    .map(({ widget: { id } }) => put(setWidgetState(id, { isFadeOut: true })));

  const updateChartsWidgets = dashboardWidgets
    .filter(
      ({ widget: { type, id } }) =>
        !widgetConnectionIds.includes(id) && type === 'visualization'
    )
    .map(({ widget }) => {
      const { id } = widget as ChartWidget;
      const isHighlighted = false;
      let isTitleCover = false;
      let isFadeOut = true;
      let isDetached = false;

      const isInDetachedPool = detachedConnectionsIds.includes(id);
      if (isInDetachedPool) {
        const { title } = detachedWidgetConnections.find(
          ({ widgetId }) => widgetId === id
        );
        isFadeOut = false;
        isDetached = true;
        isTitleCover = !title;
      }

      return put(
        setWidgetState(id, {
          isHighlighted,
          isFadeOut,
          isDetached,
          isTitleCover,
        })
      );
    });

  const updateChartWidgetsFromConnectionsPool = dashboardWidgets
    .filter(
      ({ widget: { type, id } }) =>
        widgetConnectionIds.includes(id) && type === 'visualization'
    )
    .map(({ widget }) => {
      const { id } = widget as ChartWidget;

      const { isConnected, title } = widgetConnections.find(
        ({ widgetId }) => widgetId === id
      );
      const isHighlighted = isConnected;
      const isDetached = false;
      const isTitleCover = !title;
      const isFadeOut = false;

      return put(
        setWidgetState(id, {
          isHighlighted,
          isFadeOut,
          isDetached,
          isTitleCover,
        })
      );
    });

  yield all([
    ...fadeOutWidgets,
    ...updateChartWidgetsFromConnectionsPool,
    ...updateChartsWidgets,
  ]);
}

/**
 * Synchronize widget connections based on selected event stream
 *
 * @param dashboardId - Dashboard identifer
 * @param filterWidgetId - Filter widget identifier
 * @param connectByDefault - Connected widgets by default
 * @return void
 *
 */
export function* synchronizeFilterConnections(
  dashboardId: string,
  filterWidgetId: string,
  connectByDefault?: boolean
) {
  try {
    while (true) {
      const action = yield take(SET_EVENT_STREAM);
      const {
        payload: { eventStream },
      } = action;

      yield put(setTargetProperty(null));
      const widgetConnections: FilterConnection[] = yield call(
        getFilterWidgetConnections,
        dashboardId,
        filterWidgetId,
        eventStream,
        connectByDefault
      );

      const detachedConnections: FilterConnection[] = yield call(
        getDetachedFilterWidgetConnections,
        dashboardId,
        filterWidgetId,
        eventStream
      );

      yield put(setEditorDetachedConnections(detachedConnections));
      yield put(setEditorConnections(widgetConnections));

      yield call(
        updateWidgetsDistinction,
        dashboardId,
        filterWidgetId,
        widgetConnections
      );
    }
  } finally {
    if (yield cancelled()) console.log('cancel');
  }
}

export function* editFilterWidget({
  payload,
}: ReturnType<typeof editFilterWidgetAction>) {
  const { id: filterWidgetId } = payload;
  const dashboardId = yield select(appSelectors.getActiveDashboard);

  yield put(setupDashboardEventStreams(dashboardId));

  const {
    settings: { eventStream, targetProperty, name },
  }: FilterWidget = yield select(getWidgetSettings, filterWidgetId);

  const widgetConnections: FilterConnection[] = yield call(
    getFilterWidgetConnections,
    dashboardId,
    filterWidgetId,
    eventStream,
    false
  );

  const detachedConnections = yield call(
    getDetachedFilterWidgetConnections,
    dashboardId,
    filterWidgetId,
    eventStream
  );

  yield put(setEditorDetachedConnections(detachedConnections));
  yield put(setEventStream(eventStream));
  yield put(setTargetProperty(targetProperty));
  yield put(setEditorConnections(widgetConnections));
  yield put(setName(name));

  yield call(
    updateWidgetsDistinction,
    dashboardId,
    filterWidgetId,
    widgetConnections
  );

  yield put(openEditor());

  const synchronizeConnectionsTask = yield fork(
    synchronizeFilterConnections,
    dashboardId,
    filterWidgetId,
    true
  );

  const action = yield take([APPLY_EDITOR_SETTINGS, CLOSE_EDITOR]);
  yield cancel(synchronizeConnectionsTask);

  if (action.type === APPLY_EDITOR_SETTINGS) {
    const state = yield select();
    const { detachedWidgetConnections } = getFilterSettings(state);

    const detachedCharts = detachedWidgetConnections.map((connection) =>
      getWidget(state, connection.widgetId)
    );

    const resetChartWidgetConnections = detachedCharts.map(({ widget }) => {
      const { id, filterIds } = widget as ChartWidget;
      const chartFilterIds = new Set<string>(filterIds);
      chartFilterIds.delete(filterWidgetId);

      return put(updateChartWidgetFiltersConnections(id, [...chartFilterIds]));
    });

    yield all(resetChartWidgetConnections);

    yield call(applyFilterUpdates, filterWidgetId);

    yield put(closeEditor());
    yield put(saveDashboard(dashboardId));
  }

  const {
    settings: { widgets: dashboardWidgetsIds },
  } = yield select(getDashboard, dashboardId);

  yield all(
    dashboardWidgetsIds.map((widgetId: string) =>
      put(
        setWidgetState(widgetId, {
          isHighlighted: false,
          isFadeOut: false,
          isDetached: false,
          isTitleCover: false,
        })
      )
    )
  );

  yield put(resetEditor());
}

/**
 * Flow responsible for setup filter widget.
 *
 * @param widgetId - Widget identifer
 * @return void
 *
 */
export function* setupFilterWidget(widgetId: string) {
  const filterWidgetId = widgetId;
  const dashboardId = yield select(appSelectors.getActiveDashboard);

  yield put(setupDashboardEventStreams(dashboardId));
  yield take(ADD_WIDGET_TO_DASHBOARD);

  yield put(openEditor());

  const synchronizeConnectionsTask = yield fork(
    synchronizeFilterConnections,
    dashboardId,
    filterWidgetId,
    true
  );

  const action = yield take([APPLY_EDITOR_SETTINGS, CLOSE_EDITOR]);
  yield cancel(synchronizeConnectionsTask);

  if (action.type === APPLY_EDITOR_SETTINGS) {
    yield call(applyFilterUpdates, filterWidgetId);

    yield put(closeEditor());
    yield put(saveDashboard(dashboardId));
  } else {
    yield put(removeWidgetFromDashboard(dashboardId, filterWidgetId));
  }

  const {
    settings: { widgets: dashboardWidgetsIds },
  } = yield select(getDashboard, dashboardId);

  yield all(
    dashboardWidgetsIds.map((widgetId: string) =>
      put(
        setWidgetState(widgetId, {
          isHighlighted: false,
          isFadeOut: false,
          isDetached: false,
          isTitleCover: false,
        })
      )
    )
  );

  yield put(resetEditor());
}

/**
 * Unapply filter widget to initial state and update connected widgets
 *
 * @param filterId - Filter identifer
 * @return void
 *
 */
export function* unapplyFilterWidget({
  payload,
}: ReturnType<typeof unapplyFilterWidgetAction>) {
  const { filterId } = payload;
  const {
    data,
    widget: {
      settings: { widgets },
    },
  } = yield select(getWidget, filterId);
  const dataWithoutFilter = data;
  delete dataWithoutFilter.filter;

  yield put(
    setWidgetState(filterId, { isActive: false, data: dataWithoutFilter })
  );
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
 * Reset filters to initial state for specified dashboard
 *
 * @param dashboardId - Dashboard identifier
 * @return void
 *
 */
export function* resetFilterWidgets({
  payload,
}: ReturnType<typeof resetFilterWidgetsAction>) {
  const { dashboardId } = payload;
  const state = yield select();
  const {
    settings: { widgets: widgetsIds },
  } = getDashboard(state, dashboardId);

  const datePickersUpdate = widgetsIds
    .map((widgetId) => getWidgetSettings(state, widgetId))
    .filter(({ type }) => type === 'filter')
    .map(({ id }) => put(setWidgetState(id, { isActive: false, data: null })));

  yield all(datePickersUpdate);
}
