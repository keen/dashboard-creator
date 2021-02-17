import { all, call, put, select, take } from 'redux-saga/effects';
import {
  ADD_WIDGET_TO_DASHBOARD,
  getDashboard,
  saveDashboard,
} from '../../dashboards';
import { getWidget } from '../selectors';
import { ChartWidget } from '../types';
import { FilterConnection } from '../../filter/types';
import { getActiveDashboard } from '../../app';
// import {getFilterSettings} from "../../filter/selectors";
import {
  closeEditor,
  openEditor,
  setEditorConnections,
} from '../../filter/actions';

import { setWidgetState } from '../actions';
import { APPLY_EDITOR_SETTINGS, CLOSE_EDITOR } from '../../filter/constants';

/**
 * Get possible filter widget connections.
 *
 * @param dashboardId - Dashboard identifer
 * @param widgetId - Widget identifer
 * @param connectByDefault - Connects all widgets by default
 * @param eventCollection - Event collection to filter
 * @return void
 *
 */
export function* getFilterWidgetConnections(
  dashboardId: string,
  widgetId: string,
  connectByDefault?: boolean,
  eventCollection?: string
) {
  const state = yield select();
  const {
    settings: { widgets: widgetsIds },
  } = getDashboard(state, dashboardId);

  const widgets: FilterConnection[] = widgetsIds
    .map((widgetId) => getWidget(state, widgetId))
    .sort(
      (widgetA, widgetB) =>
        widgetA.widget.position.y - widgetB.widget.position.y
    )
    .filter(
      ({ widget, data }) =>
        widget.type === 'visualization' &&
        data.query.analysis_type !== 'funnel' &&
        (data.query.event_collection === eventCollection || !eventCollection)
    )
    .map(({ widget }) => {
      const {
        id,
        filterIds,
        settings: { widgetSettings },
      } = widget as ChartWidget;
      return {
        widgetId: id,
        isConnected: connectByDefault ? true : !!filterIds,
        title: 'title' in widgetSettings ? widgetSettings.title : null,
        positionIndex: widgetsIds.indexOf(id) + 1,
      };
    });
  return widgets;
}

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
 * Flow responsible for setup filter widget.
 *
 * @param widgetId - Widget identifer
 * @return void
 *
 */
export function* setupFilterWidget(widgetId: string) {
  const filterWidgetId = widgetId;
  const dashboardId = yield select(getActiveDashboard);

  yield take(ADD_WIDGET_TO_DASHBOARD);

  const {
    settings: { widgets: dashboardWidgetsIds },
  } = yield select(getDashboard, dashboardId);

  const widgetConnections = yield call(
    getFilterWidgetConnections,
    dashboardId,
    filterWidgetId
  );

  yield put(setEditorConnections(widgetConnections));

  const widgetsConnectionsPool = widgetConnections.map(
    ({ widgetId }) => widgetId
  );

  const fadeOutWidgets = dashboardWidgetsIds
    .filter(
      (id: string) =>
        !widgetsConnectionsPool.includes(id) && id !== filterWidgetId
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
    // yield call(applyFilterUpdates, filterWidgetId);

    yield put(closeEditor());
    yield put(saveDashboard(dashboardId));
  }
}
