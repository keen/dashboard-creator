import { put, select, call, take, getContext, all } from 'redux-saga/effects';
import { Query } from '@keen.io/query';
import { SET_QUERY_EVENT, SET_CHART_SETTINGS } from '@keen.io/query-creator';

import {
  initializeChartWidget as initializeChartWidgetAction,
  editChartWidget as editChartWidgetAction,
  setWidgetState,
  finishChartWidgetConfiguration,
  savedQueryUpdated,
} from '../actions';

import { getWidget, getWidgetSettings } from '../selectors';

import { updateSaveQuery } from '../../../modules/queries';

import {
  saveDashboard,
  updateAccessKeyOptions,
} from '../../../modules/dashboards';

import { NOTIFICATION_MANAGER, PUBSUB, TRANSLATIONS } from '../../../constants';

import { WidgetItem, ChartWidget, WidgetErrors } from '../types';
import { appSelectors } from '../../app';
import { chartEditorActions, chartEditorSelectors } from '../../chartEditor';

/**
 * Creates ad-hoc query with date picker and filters modifiers.
 *
 * @param query - query settings
 * @param datePickerId - date picker widget id
 * @return void
 *
 */
export function* prepareChartWidgetQuery(chartWidget: WidgetItem) {
  const { widget, data: chartData } = chartWidget;
  const { datePickerId, filterIds, query: chartQuery } = widget as ChartWidget;

  let hasQueryModifiers = false;
  let query = chartQuery;
  let queryModifiers: Record<string, any> = {};

  if (datePickerId) {
    const { isActive, data: datePickerSettings } = yield select(
      getWidget,
      datePickerId
    );
    hasQueryModifiers = isActive;

    if (datePickerSettings) {
      const { timeframe, timezone } = datePickerSettings;
      queryModifiers = {
        ...queryModifiers,
        timeframe,
        timezone,
      };
    }
  }

  const queryFilters = [];

  if (filterIds && filterIds.length > 0) {
    const connectedFilters = yield all(
      filterIds.map((widgetId: string) => select(getWidget, widgetId))
    );
    connectedFilters.forEach((filter) => {
      if (filter.isActive) {
        hasQueryModifiers = true;
        if (filter.data) {
          queryFilters.push(filter.data.filter);
        }
      }
    });
  }

  if (hasQueryModifiers) {
    const { query: querySettings } = chartData as { query: Query };
    const filters = querySettings['filters']
      ? [...querySettings['filters'], ...queryFilters]
      : queryFilters;
    if ('steps' in querySettings) {
      query = {
        ...querySettings,
        steps: querySettings.steps.map((step) => ({
          ...step,
          ...queryModifiers,
        })),
      };
    } else {
      query = {
        ...querySettings,
        ...queryModifiers,
        filters: filters,
      };
    }
  }

  return {
    query,
    hasQueryModifiers,
  };
}

/**
 * Setup chart widget state for query with different event collection than applied filters
 *
 * @param widgetId - Widget identifier
 * @param visualizationType - Type of visualization
 * @return void
 *
 */
export function* handleInconsistentFilters(widgetId: string) {
  const i18n = yield getContext(TRANSLATIONS);
  const error = {
    title: i18n.t('widget_errors.inconsistent_filter_title'),
    message: i18n.t('widget_errors.inconsistent_filter_message'),
    code: WidgetErrors.INCONSISTENT_FILTER,
  };

  const widgetState: Partial<WidgetItem> = {
    isInitialized: true,
    error,
  };

  yield put(setWidgetState(widgetId, widgetState));
}

/**
 * Flow responsible for checking if widget has filters with the same event stream and clearing or setting appropriate error
 *
 * @param chartWidget - Chart widget
 * @return boolean value stating if widget has inconsistent filters
 *
 */
export function* checkIfChartWidgetHasInconsistentFilters(chartWidget: any) {
  const connectedFilterIds = chartWidget.widget.filterIds;
  const connectedFilters = yield all(
    connectedFilterIds.map((filterId) => select(getWidget, filterId))
  );

  const connectedFiltersEventStreams = connectedFilters
    .filter((filter) => filter.isActive)
    .map((connectedFilter) => {
      return connectedFilter.widget.settings.eventStream;
    });

  const widgetHasInconsistentFilters =
    chartWidget.data?.query?.event_collection &&
    connectedFiltersEventStreams.length > 0 &&
    connectedFiltersEventStreams.some(
      (eventStream: string) =>
        eventStream !== chartWidget.data.query.event_collection
    );

  if (
    chartWidget.error?.code === WidgetErrors.INCONSISTENT_FILTER &&
    !widgetHasInconsistentFilters
  ) {
    yield put(
      setWidgetState(chartWidget.widget.id, {
        isInitialized: true,
        error: null,
      })
    );
  } else if (widgetHasInconsistentFilters) {
    yield call(handleInconsistentFilters, chartWidget.widget.id);
  }

  return widgetHasInconsistentFilters;
}

/**
 * Flow responsible for editing widget connected
 * with saved query.
 *
 * @param widgetId - Widget identifer
 * @return void
 *
 */
export function* editChartSavedQuery(widgetId: string) {
  const {
    visualization: { type: widgetType, chartSettings, widgetSettings },
    hasQueryChanged,
    querySettings,
  } = yield select(chartEditorSelectors.getChartEditor);

  const widgetState = {
    isInitialized: false,
    isConfigured: false,
    error: null,
    data: null,
  };

  if (hasQueryChanged) {
    yield put(chartEditorActions.closeEditor());
    yield put(chartEditorActions.showQueryUpdateConfirmation());

    const action = yield take([
      chartEditorActions.hideQueryUpdateConfirmation.type,
      chartEditorActions.confirmSaveQueryUpdate.type,
      chartEditorActions.useQueryForWidget.type,
    ]);

    if (action.type === chartEditorActions.useQueryForWidget.type) {
      yield put(setWidgetState(widgetId, widgetState));
      yield put(
        finishChartWidgetConfiguration(
          widgetId,
          querySettings,
          widgetType,
          chartSettings,
          widgetSettings
        )
      );

      yield put(initializeChartWidgetAction(widgetId));
      yield put(updateAccessKeyOptions());

      const dashboardId = yield select(appSelectors.getActiveDashboard);
      yield put(saveDashboard(dashboardId));
      yield put(chartEditorActions.resetEditor());
    } else if (action.type === chartEditorActions.confirmSaveQueryUpdate.type) {
      try {
        const { query: queryName } = yield select(getWidgetSettings, widgetId);

        const metadata = {
          visualization: {
            type: widgetType,
            chartSettings,
            widgetSettings,
          },
        };
        yield call(updateSaveQuery, queryName, querySettings, metadata);

        yield put(setWidgetState(widgetId, widgetState));

        yield put(
          finishChartWidgetConfiguration(
            widgetId,
            queryName,
            widgetType,
            chartSettings,
            widgetSettings
          )
        );

        yield put(initializeChartWidgetAction(widgetId));

        const dashboardId = yield select(appSelectors.getActiveDashboard);
        yield put(saveDashboard(dashboardId));
        yield put(savedQueryUpdated(widgetId, queryName));
      } catch (err) {
        const notificationManager = yield getContext(NOTIFICATION_MANAGER);
        yield notificationManager.showNotification({
          type: 'error',
          translateMessage: true,
          message: 'notifications.update_save_query_error',
        });
      }
    }

    yield put(chartEditorActions.hideQueryUpdateConfirmation());
    yield put(chartEditorActions.resetEditor());
  } else {
    yield put(chartEditorActions.closeEditor());
    yield take(chartEditorActions.editorUnmounted.type);
    yield put(chartEditorActions.resetEditor());

    yield put(setWidgetState(widgetId, widgetState));
    const { query: queryName } = yield select(getWidgetSettings, widgetId);

    yield put(
      finishChartWidgetConfiguration(
        widgetId,
        queryName,
        widgetType,
        chartSettings,
        widgetSettings
      )
    );

    yield put(initializeChartWidgetAction(widgetId));

    const dashboardId = yield select(appSelectors.getActiveDashboard);
    yield put(saveDashboard(dashboardId));
  }
}

/**
 * Flow responsible for editing chart widget.
 *
 * @param widgetId - Widget identifer
 * @return void
 *
 */
export function* editChartWidget({
  payload,
}: ReturnType<typeof editChartWidgetAction>) {
  const { id } = payload;

  const state = yield select();
  const widgetItem = getWidget(state, id);

  const {
    widget,
    data: { query },
  } = widgetItem;

  const {
    query: widgetQuery,
    settings: { visualizationType, chartSettings, widgetSettings },
  } = widget as ChartWidget;
  const isSavedQuery = typeof widgetQuery === 'string';

  yield put(chartEditorActions.setQueryType(isSavedQuery));

  yield put(
    chartEditorActions.setVisualizationSettings({
      type: visualizationType,
      chartSettings,
      widgetSettings,
    })
  );
  yield put(chartEditorActions.setEditMode(true));
  yield put(chartEditorActions.setQuerySettings(query));
  yield put(chartEditorActions.setQueryResult(widgetItem.data));

  yield put(chartEditorActions.openEditor());

  yield take(chartEditorActions.editorMounted.type);
  const pubsub = yield getContext(PUBSUB);

  yield pubsub.publish(SET_QUERY_EVENT, { query });

  if (chartSettings?.stepLabels && chartSettings.stepLabels.length) {
    const { stepLabels } = chartSettings;
    yield pubsub.publish(SET_CHART_SETTINGS, {
      chartSettings: { stepLabels },
    });
  }

  const action = yield take([
    chartEditorActions.closeEditor.type,
    chartEditorActions.applyConfiguration.type,
  ]);

  if (action.type === chartEditorActions.closeEditor.type) {
    yield take(chartEditorActions.editorUnmounted.type);
    yield put(chartEditorActions.resetEditor());
  } else {
    const {
      isSavedQuery,
      visualization: { type: widgetType, chartSettings, widgetSettings },
      querySettings,
    } = yield select(chartEditorSelectors.getChartEditor);

    if (isSavedQuery) {
      yield* editChartSavedQuery(id);
    } else {
      const widgetState = {
        isInitialized: false,
        isConfigured: false,
        error: null,
        data: null,
      };

      yield put(setWidgetState(id, widgetState));
      yield put(
        finishChartWidgetConfiguration(
          id,
          querySettings,
          widgetType,
          chartSettings,
          widgetSettings
        )
      );

      yield put(initializeChartWidgetAction(id));

      yield put(chartEditorActions.closeEditor());
      yield take(chartEditorActions.editorUnmounted.type);
      yield put(chartEditorActions.resetEditor());

      const dashboardId = yield select(appSelectors.getActiveDashboard);
      yield put(saveDashboard(dashboardId));
    }
  }
}
