/* eslint-disable @typescript-eslint/naming-convention */
import {
  put,
  takeEvery,
  takeLatest,
  select,
  getContext,
} from 'redux-saga/effects';
import { createTree } from '@keen.io/ui-core';

import {
  updateConnection,
  setEventStreamsPool,
  setEventStream,
  setSchemaProcessing,
  setEventStreamSchema,
  setSchemaProcessingError,
  setupDashboardEventStreams as setupDashboardEventStreamsAction,
} from './actions';

import { setWidgetState, getWidget, ChartWidget } from '../widgets';

import { getDashboard } from '../dashboards';

import {
  UPDATE_CONNECTION,
  SET_EVENT_STREAM,
  SETUP_DASHBOARD_EVENT_STREAMS,
  FILTER_SCHEMA_PROPERTY_TYPE,
} from './constants';

import { KEEN_ANALYSIS } from '../../constants';

import { FilterConnection } from './types';

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
    .map((widgetId) => getWidget(state, widgetId))
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
    .map((widgetId) => getWidget(state, widgetId))
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

/**
 * Preapares schema for selected event stream
 *
 * @param eventStream - Name of selected event stream
 * @return void
 *
 */
export function* prepareFilterTargetProperties({
  payload,
}: ReturnType<typeof setEventStream>) {
  const { eventStream } = payload;

  yield put(setSchemaProcessing(true));
  const client = yield getContext(KEEN_ANALYSIS);

  try {
    const url = client.url(`/3.0/projects/{projectId}/events/${eventStream}`, {
      api_key: client.config.masterKey,
    });

    const { properties } = yield fetch(url).then((response) => response.json());
    const filteredProperties = {};

    Object.keys(properties)
      .filter(
        (propertyName) =>
          properties[propertyName] === FILTER_SCHEMA_PROPERTY_TYPE
      )
      .forEach(
        (propertyName) =>
          (filteredProperties[propertyName] = FILTER_SCHEMA_PROPERTY_TYPE)
      );

    const schemaTree = yield createTree(filteredProperties);
    const schemaList = Object.keys(filteredProperties).map((key: string) => ({
      path: key,
      type: filteredProperties[key],
    }));

    yield put(setEventStreamSchema(filteredProperties, schemaTree, schemaList));
    yield put(setSchemaProcessingError(false));
  } catch (err) {
    yield put(setSchemaProcessingError(true));
  } finally {
    yield put(setSchemaProcessing(false));
  }
}

/**
 * Set event streams used on dashboard
 *
 * @param dashboardId - Dashboard identifer
 * @return void
 *
 */
export function* setupDashboardEventStreams({
  payload,
}: ReturnType<typeof setupDashboardEventStreamsAction>) {
  const { dashboardId } = payload;

  const state = yield select();
  const {
    settings: { widgets: widgetsIds },
  } = getDashboard(state, dashboardId);

  const eventStreams = new Set<string>();

  widgetsIds
    .map((widgetId) => getWidget(state, widgetId))
    .filter(({ widget: { type } }) => type === 'visualization')
    .map(({ data }) => data?.query?.event_collection)
    .forEach((eventStream) => {
      if (eventStream) eventStreams.add(eventStream);
    });

  yield put(setEventStreamsPool([...eventStreams]));
}

/**
 * Set highlight state for widget during date picker configuration
 *
 * @param widgetId - Widget identifer
 * @param isConnected - connection state
 * @return void
 *
 */
export function* setWidgetHighlight({
  payload,
}: ReturnType<typeof updateConnection>) {
  const { widgetId, isConnected } = payload;
  yield put(
    setWidgetState(widgetId, {
      isHighlighted: isConnected,
    })
  );
}

export function* filterSaga() {
  yield takeLatest(SET_EVENT_STREAM, prepareFilterTargetProperties);
  yield takeLatest(SETUP_DASHBOARD_EVENT_STREAMS, setupDashboardEventStreams);
  yield takeEvery(UPDATE_CONNECTION, setWidgetHighlight);
}
