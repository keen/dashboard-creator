import { put, select, call, getContext } from 'redux-saga/effects';

import {
  initializeChartWidget as initializeChartWidgetAction,
  setWidgetState,
  setWidgetLoading,
  setChartWidgetVisualization,
} from '../../actions';

import { widgetsSelectors } from '../../selectors';

import {
  prepareChartWidgetQuery,
  checkIfChartWidgetHasInconsistentFilters,
} from '../chartWidget';

import { KEEN_ANALYSIS, TRANSLATIONS } from '../../../../constants';

import {
  WidgetItem,
  ChartWidget,
  WidgetErrors,
  AnalysisError,
} from '../../types';
import { queriesActions, queriesSelectors } from '../../../queries';
import { serializeSavedQuery } from '../../../queries/serializers';

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
  const chartWidget: WidgetItem<ChartWidget> = yield select(
    widgetsSelectors.getWidget,
    id
  );

  try {
    const { query, hasQueryModifiers } = yield call(
      prepareChartWidgetQuery,
      chartWidget
    );
    yield put(setWidgetLoading(id, true));

    const widgetHasInconsistentFilters = yield call(
      checkIfChartWidgetHasInconsistentFilters,
      chartWidget
    );

    if (widgetHasInconsistentFilters) return;

    const client = yield getContext(KEEN_ANALYSIS);
    const isSavedQueryWidget = typeof query === 'string';

    const requestBody = isSavedQueryWidget ? { savedQueryName: query } : query;

    let analysisResult = yield client.query(requestBody);

    /** Funnel analysis do not return query settings in response */
    if (typeof query !== 'string' && query.analysis_type === 'funnel') {
      analysisResult = {
        ...analysisResult,
        query,
      };
    }

    if (hasQueryModifiers) {
      yield put(
        queriesActions.addInterimQuery({ widgetId: id, data: analysisResult })
      );
      yield put(setWidgetState(id, { isInitialized: true }));
    } else {
      const interimQuery = yield select(queriesSelectors.getInterimQuery, id);
      if (interimQuery) {
        yield put(queriesActions.removeInterimQuery(id));
      }

      if (isSavedQueryWidget) {
        const {
          visualization: { type, chartSettings, widgetSettings },
        } = serializeSavedQuery(analysisResult);
        yield put(
          setChartWidgetVisualization(id, type, chartSettings, widgetSettings)
        );
      }

      const widgetState: Partial<WidgetItem> = {
        isInitialized: true,
        data: analysisResult,
      };

      yield put(setWidgetState(id, widgetState));
    }
  } catch (err) {
    const { body, error_code: code } = err;
    let errorCode = WidgetErrors.CANNOT_INITIALIZE;
    let errorMessage = body;

    if (code === AnalysisError.RESOURCE_NOT_FOUND) {
      const i18n = yield getContext(TRANSLATIONS);
      errorCode = WidgetErrors.SAVED_QUERY_NOT_EXIST;
      errorMessage = i18n.t('widget_errors.resource_not_found');
    }

    yield put(
      setWidgetState(id, {
        isInitialized: true,
        error: {
          message: errorMessage,
          code: errorCode,
        },
      })
    );
  } finally {
    yield put(setWidgetLoading(id, false));
  }
}
