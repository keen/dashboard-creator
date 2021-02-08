import { put, select, call, take, getContext } from 'redux-saga/effects';
import { getAvailableWidgets } from '@keen.io/widget-picker';
import { Query } from '@keen.io/query';
import { SET_QUERY_EVENT, SET_CHART_SETTINGS } from '@keen.io/query-creator';

import {
  initializeChartWidget as initializeChartWidgetAction,
  editChartWidget as editChartWidgetAction,
  setWidgetState,
  setWidgetLoading,
  finishChartWidgetConfiguration,
  savedQueryUpdated,
} from '../actions';

import { getWidget, getWidgetSettings } from '../selectors';

import {
  addInterimQuery,
  removeInterimQuery,
  getInterimQuery,
  updateSaveQuery,
} from '../../../modules/queries';

import {
  saveDashboard,
  updateAccessKeyOptions,
} from '../../../modules/dashboards';

import { getActiveDashboard } from '../../../modules/app';

import {
  openEditor,
  closeEditor,
  resetEditor,
  getChartEditor,
  setEditMode,
  setQueryType,
  setQuerySettings,
  setQueryResult,
  setVisualizationSettings,
  showQueryUpdateConfirmation,
  hideQueryUpdateConfirmation,
  CLOSE_EDITOR as CLOSE_CHART_EDITOR,
  EDITOR_MOUNTED,
  EDITOR_UNMOUNTED,
  APPLY_CONFIGURATION,
  CONFIRM_SAVE_QUERY_UPDATE,
  HIDE_QUERY_UPDATE_CONFIRMATION,
  USE_QUERY_FOR_WIDGET,
} from '../../../modules/chartEditor';

import {
  NOTIFICATION_MANAGER,
  PUBSUB,
  KEEN_ANALYSIS,
  TRANSLATIONS,
} from '../../../constants';

import { WidgetItem, ChartWidget } from '../types';

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
  const { datePickerId, query: chartQuery } = widget as ChartWidget;

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

  if (hasQueryModifiers) {
    const { query: querySettings } = chartData as { query: Query };
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
      };
    }
  }

  return {
    query,
    hasQueryModifiers,
  };
}

/**
 * Setup chart widget state for query detached from visualization settings
 *
 * @param widgetId - Widget identifier
 * @param visualizationType - Type of visualization
 * @return void
 *
 */
export function* handleDetachedQuery(
  widgetId: string,
  visualizationType: string
) {
  const { t } = yield getContext(TRANSLATIONS);
  const error = {
    title: t('widget_errors.detached_query_title', {
      chart: visualizationType,
    }),
    message: t('widget_errors.detached_query_message'),
  };

  const widgetState: Partial<WidgetItem> = {
    isInitialized: true,
    data: null,
    error,
  };

  yield put(setWidgetState(widgetId, widgetState));
}

/**
 * Flow responsible for initializing chart widget.
 *
 * @param id - Widget identifer
 * @return void
 *
 */
export function* initializeChartWidget({
  payload,
}: ReturnType<typeof initializeChartWidgetAction>) {
  const { id } = payload;
  const chartWidget = yield select(getWidget, id);

  const {
    widget: {
      settings: { visualizationType },
    },
  } = chartWidget;

  try {
    const { query, hasQueryModifiers } = yield call(
      prepareChartWidgetQuery,
      chartWidget
    );
    yield put(setWidgetLoading(id, true));

    const client = yield getContext(KEEN_ANALYSIS);
    const requestBody =
      typeof query === 'string' ? { savedQueryName: query } : query;

    let analysisResult = yield client.query(requestBody);

    /** Funnel analysis do not return query settings in response */
    if (typeof query !== 'string' && query.analysis_type === 'funnel') {
      analysisResult = {
        ...analysisResult,
        query,
      };
    }

    const { query: querySettings } = analysisResult;
    const isDetachedQuery = !getAvailableWidgets(querySettings).includes(
      visualizationType
    );

    if (isDetachedQuery) {
      yield call(handleDetachedQuery, id, visualizationType);
    } else {
      if (hasQueryModifiers) {
        yield put(addInterimQuery(id, analysisResult));
        yield put(setWidgetState(id, { isInitialized: true }));
      } else {
        const interimQuery = yield select(getInterimQuery, id);
        if (interimQuery) {
          yield put(removeInterimQuery(id));
        }
        const widgetState: Partial<WidgetItem> = {
          isInitialized: true,
          data: analysisResult,
        };

        yield put(setWidgetState(id, widgetState));
      }
    }
  } catch (err) {
    const { body } = err;
    yield put(
      setWidgetState(id, {
        isInitialized: true,
        error: {
          message: body,
        },
      })
    );
  } finally {
    yield put(setWidgetLoading(id, false));
  }
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
  } = yield select(getChartEditor);

  const widgetState = {
    isInitialized: false,
    isConfigured: false,
    error: null,
    data: null,
  };

  if (hasQueryChanged) {
    yield put(closeEditor());
    yield put(showQueryUpdateConfirmation());

    const action = yield take([
      HIDE_QUERY_UPDATE_CONFIRMATION,
      CONFIRM_SAVE_QUERY_UPDATE,
      USE_QUERY_FOR_WIDGET,
    ]);

    if (action.type === USE_QUERY_FOR_WIDGET) {
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

      const dashboardId = yield select(getActiveDashboard);
      yield put(saveDashboard(dashboardId));
      yield put(resetEditor());
    } else if (action.type === CONFIRM_SAVE_QUERY_UPDATE) {
      try {
        const { query: queryName } = yield select(getWidgetSettings, widgetId);
        const metadata = {
          visualization: { type: widgetType, chartSettings, widgetSettings },
        };
        yield* updateSaveQuery(queryName, querySettings, metadata);

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

        const dashboardId = yield select(getActiveDashboard);
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

    yield put(hideQueryUpdateConfirmation());
    yield put(resetEditor());
  } else {
    yield put(closeEditor());
    yield take(EDITOR_UNMOUNTED);
    yield put(resetEditor());

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

    const dashboardId = yield select(getActiveDashboard);
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

  yield put(setQueryType(isSavedQuery));

  yield put(
    setVisualizationSettings(visualizationType, chartSettings, widgetSettings)
  );
  yield put(setEditMode(true));
  yield put(setQuerySettings(query));
  yield put(setQueryResult(widgetItem.data));

  yield put(openEditor());

  yield take(EDITOR_MOUNTED);
  const pubsub = yield getContext(PUBSUB);
  yield pubsub.publish(SET_QUERY_EVENT, { query });

  if (chartSettings?.stepLabels && chartSettings.stepLabels.length) {
    const { stepLabels } = chartSettings;
    yield pubsub.publish(SET_CHART_SETTINGS, {
      chartSettings: { stepLabels },
    });
  }

  const action = yield take([CLOSE_CHART_EDITOR, APPLY_CONFIGURATION]);

  if (action.type === CLOSE_CHART_EDITOR) {
    yield take(EDITOR_UNMOUNTED);
    yield put(resetEditor());
  } else {
    const {
      isSavedQuery,
      visualization: { type: widgetType, chartSettings, widgetSettings },
      querySettings,
    } = yield select(getChartEditor);

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

      yield put(closeEditor());
      yield take(EDITOR_UNMOUNTED);
      yield put(resetEditor());

      const dashboardId = yield select(getActiveDashboard);
      yield put(saveDashboard(dashboardId));
    }
  }
}
