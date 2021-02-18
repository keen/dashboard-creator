import {
  all,
  call,
  put,
  select,
  take,
  cancel,
  fork,
  cancelled,
} from 'redux-saga/effects';
import {
  ADD_WIDGET_TO_DASHBOARD,
  getDashboard,
  saveDashboard,
} from '../../dashboards';
import { getWidget, getWidgetSettings } from '../selectors';

import { FilterConnection, ReducerState } from '../../filter/types';
import { getActiveDashboard } from '../../app';
import { ChartWidget } from '../types';

import {
  openEditor,
  closeEditor,
  setEditorConnections,
  setupDashboardEventStreams,
  getFilterWidgetConnections,
  SET_EVENT_STREAM,
  getFilterSettings,
} from '../../filter';

import {
  setFilterWidget,
  setWidgetState,
  updateChartWidgetFiltersConnections,
} from '../actions';
import { APPLY_EDITOR_SETTINGS, CLOSE_EDITOR } from '../../filter/constants';

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
    setFilterWidget(filterId, updatedConnections, eventStream, targetProperty)
  );
}

/**
 * Release connections after date picker widget is removed.
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
    setFilterWidget(
      filterWidgetId,
      connectedCharts,
      eventStream,
      targetProperty
    )
  );
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
function* synchronizeFilterConnections(
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

      const state = yield select();

      const {
        settings: { widgets: dashboardWidgetsIds },
      } = getDashboard(state, dashboardId);

      const widgetConnections: FilterConnection[] = yield call(
        getFilterWidgetConnections,
        dashboardId,
        filterWidgetId,
        eventStream,
        connectByDefault
      );

      yield put(setEditorConnections(widgetConnections));

      const widgetConnectionIds = widgetConnections.map(
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
          put(setWidgetState(id, { isFadeOut: true }))
        );

      const updateChartWidgets = dashboardWidgets
        .filter(({ widget: { type } }) => type === 'visualization')
        .map(({ widget: { id } }) => {
          let isHighlighted = false;
          let isTitleCover = false;
          let isFadeOut = true;

          const inConnectionsPool = widgetConnectionIds.includes(id);
          if (inConnectionsPool) {
            const { isConnected, title } = widgetConnections.find(
              ({ widgetId }) => widgetId === id
            );
            isHighlighted = isConnected;
            isTitleCover = !title;
            isFadeOut = false;
          }

          return put(
            setWidgetState(id, { isHighlighted, isFadeOut, isTitleCover })
          );
        });

      yield all([...fadeOutWidgets, ...updateChartWidgets]);
    }
  } finally {
    if (yield cancelled()) console.log('cancel');
  }
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
  const dashboardId = yield select(getActiveDashboard);

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
          isTitleCover: false,
        })
      )
    )
  );
}
