import { put, select, getContext } from 'redux-saga/effects';
import { getAvailableWidgets } from '@keen.io/widget-picker';

import {
  initializeChartWidget as initializeChartWidgetAction,
  setWidgetState,
  setWidgetLoading,
} from '../actions';

import { getWidget } from '../selectors';

import { addInterimQuery } from '../../../modules/queries';

import { KEEN_ANALYSIS, TRANSLATIONS } from '../../../constants';

import { WidgetItem, ChartWidget } from '../types';

/**
 * Modifies query with date picker and filters modifiers.
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
    const { query: querySettings } = chartData;
    query = {
      ...querySettings,
      ...queryModifiers,
    };
  }

  return {
    query,
    hasQueryModifiers,
  };
}

/**
 * Modifies query with date picker and filters modifiers.
 *
 * @param query - query settings
 * @param datePickerId - date picker widget id
 * @return void
 *
 */
export function* handleDetachedQuery(
  widgetId: string,
  visualizationType: string
) {
  const i18n = yield getContext(TRANSLATIONS);
  const error = {
    title: i18n.t('widget_errors.detached_query_title', {
      chart: visualizationType,
    }),
    message: i18n.t('widget_errors.detached_query_message'),
  };

  const widgetState: Partial<WidgetItem> = {
    isInitialized: true,
    data: null,
    error,
  };

  yield put(setWidgetState(widgetId, widgetState));
}

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
    const { query, hasQueryModifiers } = yield* prepareChartWidgetQuery(
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
      yield* handleDetachedQuery(id, visualizationType);
    } else {
      if (hasQueryModifiers) {
        yield put(addInterimQuery(id, analysisResult));
        yield put(setWidgetState(id, { isInitialized: true }));
      } else {
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
