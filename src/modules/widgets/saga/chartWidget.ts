import { put, select, call, take, getContext, all } from 'redux-saga/effects';
import { Query } from '@keen.io/query';

import { getWidget, getWidgetSettings } from '../selectors';

import {
  saveDashboard,
  updateAccessKeyOptions,
} from '../../../modules/dashboards';

import {
  FEATURES,
  NOTIFICATION_MANAGER,
  TRANSLATIONS,
} from '../../../constants';

import { WidgetItem, ChartWidget, WidgetErrors } from '../types';
import { appSelectors } from '../../app';
import { chartEditorActions, chartEditorSelectors } from '../../chartEditor';
import { getConnectedDashboards } from '../../dashboards/saga';
import { queriesSagas } from '../../queries';
import { widgetsActions } from '../index';

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

  yield put(widgetsActions.setWidgetState({ id: widgetId, widgetState }));
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
      widgetsActions.setWidgetState({
        id: chartWidget.widget.id,
        widgetState: {
          isInitialized: true,
          error: null,
        },
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

    const { query: queryName } = yield select(getWidgetSettings, widgetId);
    const { enableDashboardConnections } = yield getContext(FEATURES);
    if (enableDashboardConnections) {
      yield call(getConnectedDashboards, queryName);
    }

    const action = yield take([
      chartEditorActions.hideQueryUpdateConfirmation.type,
      chartEditorActions.confirmSaveQueryUpdate.type,
      chartEditorActions.useQueryForWidget.type,
    ]);

    if (action.type === chartEditorActions.useQueryForWidget.type) {
      yield put(widgetsActions.setWidgetState({ id: widgetId, widgetState }));
      yield put(
        widgetsActions.finishChartWidgetConfiguration({
          id: widgetId,
          query: querySettings,
          visualizationType: widgetType,
          chartSettings,
          widgetSettings,
        })
      );

      yield put(widgetsActions.initializeChartWidget(widgetId));
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
        yield call(
          queriesSagas.updateSaveQuery,
          queryName,
          querySettings,
          metadata
        );

        yield put(widgetsActions.setWidgetState({ id: widgetId, widgetState }));

        yield put(
          widgetsActions.finishChartWidgetConfiguration({
            id: widgetId,
            query: queryName,
            visualizationType: widgetType,
            chartSettings,
            widgetSettings,
          })
        );

        yield put(widgetsActions.initializeChartWidget(widgetId));

        const dashboardId = yield select(appSelectors.getActiveDashboard);
        yield put(saveDashboard(dashboardId));
        yield put(widgetsActions.savedQueryUpdated(widgetId, queryName));
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

    yield put(widgetsActions.setWidgetState({ id: widgetId, widgetState }));
    const { query: queryName } = yield select(getWidgetSettings, widgetId);

    yield put(
      widgetsActions.finishChartWidgetConfiguration({
        id: widgetId,
        query: queryName,
        visualizationType: widgetType,
        chartSettings,
        widgetSettings,
      })
    );

    yield put(widgetsActions.initializeChartWidget(widgetId));

    const dashboardId = yield select(appSelectors.getActiveDashboard);
    yield put(saveDashboard(dashboardId));
  }
}
