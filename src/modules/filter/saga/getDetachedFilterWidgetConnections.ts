import { select } from 'redux-saga/effects';
import { getDashboard } from '../../dashboards';
import { ChartWidget, widgetsSelectors } from '../../widgets';
import { FilterConnection } from '../types';

/**
 * Get detached filter connections.
 *
 * @param dashboardId - Dashboard identifer
 * @param filterWidgetId - Filter widget identifer
 * @param eventStream - Event collection to filter
 * @return detached filter connections
 *
 */
export function* getDetachedFilterWidgetConnections(
  dashboardId: string,
  filterWidgetId: string,
  eventStream: string
) {
  const state = yield select();
  const {
    settings: { widgets: widgetsIds },
  } = getDashboard(state, dashboardId);

  const widgetsWithoutErrors = widgetsIds
    .map((widgetId) => widgetsSelectors.getWidget(state, widgetId))
    .filter((widget) => !widget.error);

  const detachedWidgets: FilterConnection[] = widgetsWithoutErrors
    .sort(
      (widgetA, widgetB) =>
        widgetA.widget.position.y - widgetB.widget.position.y
    )
    .filter(
      ({ widget, data }) =>
        widget.type === 'visualization' &&
        widget.filterIds?.includes(filterWidgetId) &&
        (!data?.query || data.query.event_collection !== eventStream)
    )
    .map(({ widget }) => {
      const {
        id,
        settings: { widgetSettings },
      } = widget as ChartWidget;
      return {
        widgetId: id,
        isConnected: true,
        title: 'title' in widgetSettings ? widgetSettings.title.content : null,
        positionIndex: widgetsIds.indexOf(id) + 1,
      };
    });

  return detachedWidgets;
}
