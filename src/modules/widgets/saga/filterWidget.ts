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
import { getWidget } from '../selectors';

import { FilterConnection } from '../../filter/types';
import { getActiveDashboard } from '../../app';

import {
  openEditor,
  closeEditor,
  setEditorConnections,
  setupDashboardEventStreams,
  getFilterWidgetConnections,
  SET_EVENT_STREAM,
} from '../../filter';

import { setWidgetState } from '../actions';
import { APPLY_EDITOR_SETTINGS, CLOSE_EDITOR } from '../../filter/constants';

// /**
//  * Apply filter connections updates to connected widgets
//  *
//  * @param filterWidgetId - Filter widget identifer
//  * @return void
//  *
//  */
// export function* applyFilterUpdates(filterWidgetId: string) {
//     const {
//         widgetConnections: updatedConnections,
//     }: { widgetConnections: FilterConnection[] } = yield select(
//         getFilterSettings
//     );
//
//     const widgetFilterConnections = updatedConnections
//         .filter(({ isConnected }) => isConnected)
//         .map(({ widgetId }) => widgetId);
//
//     const chartFiltersUpdates = updatedConnections.map(
//         ({ widgetId, isConnected }) => {
//             const filterId = isConnected ? filterWidgetId : null;
//
//             // updateChartWidgetFilterConnection
//             // return put(updateChartWidgetFilterConnection(widgetId, filterId));
//         }
//     );
//
//     // yield all(chartFiltersUpdates);
//     // yield put(setFilterWidget(datePickerWidgetId, widgetPickerConnections));
// }

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
    // yield call(applyFilterUpdates, filterWidgetId);

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
