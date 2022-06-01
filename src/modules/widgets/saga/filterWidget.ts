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

import { getWidget, getWidgetSettings } from '../selectors';

import { FilterConnection, ReducerState } from '../../filter/types';
import { ChartWidget, FilterWidget } from '../types';

import { filterActions, filterSelectors } from '../../filter';

import { KEEN_ANALYSIS } from '../../../constants';

import { getOldestTimeframe } from '../../../utils/getOldestTimeframe';
import { appSelectors } from '../../app';
import {
  getDetachedFilterWidgetConnections,
  getFilterWidgetConnections,
} from '../../filter/saga';
import { widgetsActions } from '../index';
import { dashboardsActions, dashboardsSelectors } from '../../dashboards';

/**
 * Apply filter connections updates to connected widgets
 *
 * @param filterId - filter widget identifer
 * @return void
 *
 */
export function* applyFilterModifiers({
  payload,
}: ReturnType<typeof widgetsActions.applyFilterModifiers>) {
  const { id } = payload;

  yield put(
    widgetsActions.setWidgetState({ id, widgetState: { isActive: true } })
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
 * Set filter widget settings
 *
 * @param widgetId - Widget identifier
 * @return void
 *
 */
export function* setFilterWidget({
  payload,
}: ReturnType<typeof widgetsActions.setFilterWidget>) {
  const filter = yield select(getWidget, payload.widgetId);
  const { widgets, eventStream, targetProperty } = filter.widget.settings;
  const connectedWidgets = yield all(
    widgets.map((id: string) => select(getWidget, id))
  );

  const connectedWidgetsTimeframes = connectedWidgets
    .filter(
      (connectedWidget: Record<string, any>) =>
        connectedWidget?.data && connectedWidget.data.query
    )
    .map(
      (connectedWidget: Record<string, any>) =>
        connectedWidget.data.query.timeframe
    );

  const client = yield getContext(KEEN_ANALYSIS);

  yield put(
    widgetsActions.setWidgetState({
      id: payload.widgetId,
      widgetState: {
        isLoading: true,
      },
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
      widgetsActions.setFilterPropertyList({
        filterId: filter.widget.id,
        propertyList: filterItemsSortedAlphabetically,
      })
    );
  } catch (err) {
    yield put(
      widgetsActions.setWidgetState({
        id: payload.widgetId,
        widgetState: {
          error: err,
        },
      })
    );
  } finally {
    yield put(
      widgetsActions.setWidgetState({
        id: payload.widgetId,
        widgetState: {
          isLoading: false,
        },
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
    widgetsActions.configureFilterWidget({
      id: filterId,
      widgetConnections: updatedConnections,
      eventStream,
      targetProperty,
    })
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
  } = dashboardsSelectors.getDashboard(state, dashboardId);

  const connections = widgetsIds
    .map((widgetId) => getWidgetSettings(state, widgetId))
    .filter(
      ({ type, filterIds }: ChartWidget) =>
        type === 'visualization' && filterIds.includes(deletedFilterId)
    );
  const chartWidgetsUpdates = connections.map((chart: ChartWidget) =>
    put(
      widgetsActions.updateChartWidgetFiltersConnections({
        id: chart.id,
        filterIds: chart.filterIds.filter((id) => id !== deletedFilterId),
      })
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
  }: ReducerState = yield select(filterSelectors.getFilterSettings);

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
    return put(
      widgetsActions.updateChartWidgetFiltersConnections({
        id,
        filterIds: [...chartFilterIds],
      })
    );
  });

  yield all(chartsWidgetUpdates);
  yield put(
    widgetsActions.configureFilterWidget({
      id: filterWidgetId,
      widgetConnections: connectedCharts,
      eventStream,
      targetProperty,
      name,
    })
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
  } = dashboardsSelectors.getDashboard(state, dashboardId);

  const { detachedWidgetConnections } = filterSelectors.getFilterSettings(
    state
  );

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
    .map(({ widget: { id } }) =>
      put(
        widgetsActions.setWidgetState({ id, widgetState: { isFadeOut: true } })
      )
    );

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
        widgetsActions.setWidgetState({
          id,
          widgetState: {
            isHighlighted,
            isFadeOut,
            isDetached,
            isTitleCover,
          },
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
        widgetsActions.setWidgetState({
          id,
          widgetState: {
            isHighlighted,
            isFadeOut,
            isDetached,
            isTitleCover,
          },
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
      const action = yield take(filterActions.setEventStream.type);
      const { payload: eventStream } = action;

      yield put(filterActions.setTargetProperty(null));
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

      yield put(
        filterActions.setEditorDetachedConnections(detachedConnections)
      );
      yield put(filterActions.setEditorConnections(widgetConnections));

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
}: ReturnType<typeof widgetsActions.editFilterWidget>) {
  const { id: filterWidgetId } = payload;
  const dashboardId = yield select(appSelectors.getActiveDashboard);

  yield put(filterActions.setupDashboardEventStreams(dashboardId));

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

  yield put(filterActions.setEditorDetachedConnections(detachedConnections));
  yield put(filterActions.setEventStream(eventStream));
  yield put(filterActions.setTargetProperty(targetProperty));
  yield put(filterActions.setEditorConnections(widgetConnections));
  yield put(filterActions.setName(name));

  yield call(
    updateWidgetsDistinction,
    dashboardId,
    filterWidgetId,
    widgetConnections
  );

  yield put(filterActions.openEditor());

  const synchronizeConnectionsTask = yield fork(
    synchronizeFilterConnections,
    dashboardId,
    filterWidgetId,
    true
  );

  const action = yield take([
    filterActions.applySettings.type,
    filterActions.closeEditor.type,
  ]);
  yield cancel(synchronizeConnectionsTask);

  if (action.type === filterActions.applySettings.type) {
    const state = yield select();
    const { detachedWidgetConnections } = filterSelectors.getFilterSettings(
      state
    );

    const detachedCharts = detachedWidgetConnections.map((connection) =>
      getWidget(state, connection.widgetId)
    );

    const resetChartWidgetConnections = detachedCharts.map(({ widget }) => {
      const { id, filterIds } = widget as ChartWidget;
      const chartFilterIds = new Set<string>(filterIds);
      chartFilterIds.delete(filterWidgetId);

      return put(
        widgetsActions.updateChartWidgetFiltersConnections({
          id,
          filterIds: [...chartFilterIds],
        })
      );
    });

    yield all(resetChartWidgetConnections);

    yield call(applyFilterUpdates, filterWidgetId);

    yield put(filterActions.closeEditor());
    yield put(dashboardsActions.saveDashboard(dashboardId));
  }

  const {
    settings: { widgets: dashboardWidgetsIds },
  } = yield select(dashboardsSelectors.getDashboard, dashboardId);

  yield all(
    dashboardWidgetsIds.map((widgetId: string) =>
      put(
        widgetsActions.setWidgetState({
          id: widgetId,
          widgetState: {
            isHighlighted: false,
            isFadeOut: false,
            isDetached: false,
            isTitleCover: false,
          },
        })
      )
    )
  );

  yield put(filterActions.resetEditor());
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

  yield put(filterActions.setupDashboardEventStreams(dashboardId));
  yield take(dashboardsActions.addWidgetToDashboard.type);

  yield put(filterActions.openEditor());

  const synchronizeConnectionsTask = yield fork(
    synchronizeFilterConnections,
    dashboardId,
    filterWidgetId,
    true
  );

  const action = yield take([
    filterActions.applySettings.type,
    filterActions.closeEditor.type,
  ]);
  yield cancel(synchronizeConnectionsTask);

  if (action.type === filterActions.applySettings.type) {
    yield call(applyFilterUpdates, filterWidgetId);

    yield put(filterActions.closeEditor());
    yield put(dashboardsActions.saveDashboard(dashboardId));
  } else {
    yield put(
      dashboardsActions.removeWidgetFromDashboard({
        dashboardId,
        widgetId: filterWidgetId,
      })
    );
  }

  const {
    settings: { widgets: dashboardWidgetsIds },
  } = yield select(dashboardsSelectors.getDashboard, dashboardId);

  yield all(
    dashboardWidgetsIds.map((widgetId: string) =>
      put(
        widgetsActions.setWidgetState({
          id: widgetId,
          widgetState: {
            isHighlighted: false,
            isFadeOut: false,
            isDetached: false,
            isTitleCover: false,
          },
        })
      )
    )
  );

  yield put(filterActions.resetEditor());
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
}: ReturnType<typeof widgetsActions.unapplyFilterWidget>) {
  const { filterId } = payload;
  const {
    data,
    widget: {
      settings: { widgets },
    },
  } = yield select(getWidget, filterId);
  const dataWithoutFilter = { ...data };
  delete dataWithoutFilter.filter;

  yield put(
    widgetsActions.setWidgetState({
      id: filterId,
      widgetState: { isActive: false, data: dataWithoutFilter },
    })
  );
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
 * Reset filters to initial state for specified dashboard
 *
 * @param dashboardId - Dashboard identifier
 * @return void
 *
 */
export function* resetFilterWidgets({
  payload,
}: ReturnType<typeof widgetsActions.resetFilterWidgets>) {
  const { dashboardId } = payload;
  const state = yield select();
  const dashboard = dashboardsSelectors.getDashboard(state, dashboardId);

  if (dashboard) {
    const {
      settings: { widgets: widgetsIds },
    } = dashboard;

    const datePickersUpdate = widgetsIds
      .map((widgetId) => getWidgetSettings(state, widgetId))
      .filter(({ type }) => type === 'filter')
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
