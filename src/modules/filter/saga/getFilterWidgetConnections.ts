import { select } from 'redux-saga/effects';
import { getDashboard } from '../../dashboards';
import { FilterConnection } from '../types';
import { ChartWidget, widgetsSelectors } from '../../widgets';

/**
 * Get possible filter widget connections.
 *
 * @param dashboardId - Dashboard identifer
 * @param filterWidgetId - Filter widget identifer
 * @param eventStream - Event collection to filter
 * @param connectByDefault - Connects all widgets by default
 * @return filter connections collection
 *
 */
export function* getFilterWidgetConnections(
  dashboardId: string,
  filterWidgetId: string,
  eventStream: string,
  connectByDefault?: boolean
) {
  const state = yield select();
  const {
    settings: { widgets: widgetsIds },
  } = getDashboard(state, dashboardId);

  const widgets: FilterConnection[] = widgetsIds
    .map((widgetId) => widgetsSelectors.getWidget(state, widgetId))
    .sort(
      (widgetA, widgetB) =>
        widgetA.widget.position.y - widgetB.widget.position.y
    )
    .filter(
      ({ widget, data }) =>
        widget.type === 'visualization' &&
        data?.query &&
        data.query.analysis_type !== 'funnel' &&
        data.query.event_collection === eventStream
    )
    .map(({ widget }) => {
      const {
        id,
        filterIds,
        settings: { widgetSettings },
      } = widget as ChartWidget;
      return {
        widgetId: id,
        isConnected: connectByDefault
          ? true
          : filterIds?.includes(filterWidgetId),
        title: 'title' in widgetSettings ? widgetSettings.title.content : null,
        positionIndex: widgetsIds.indexOf(id) + 1,
      };
    });

  return widgets;
}
