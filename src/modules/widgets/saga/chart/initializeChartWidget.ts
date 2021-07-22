import { put, select, call, getContext } from 'redux-saga/effects';

import {
  initializeChartWidget as initializeChartWidgetAction,
  setWidgetState,
  setWidgetLoading,
  setChartWidgetVisualization,
} from '../../actions';

import { widgetsSelectors } from '../../selectors';

import {
  serializeSavedQuery,
  addInterimQuery,
  removeInterimQuery,
  getInterimQuery,
} from '../../../../modules/queries';

import {
  prepareChartWidgetQuery,
  checkIfChartWidgetHasInconsistentFilters,
} from '../chartWidget';

import { KEEN_ANALYSIS } from '../../../../constants';

import {
  WidgetItem,
  ChartWidget,
  WidgetErrors,
  AnalysisError,
} from '../../types';

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
      yield put(addInterimQuery(id, analysisResult));
      yield put(setWidgetState(id, { isInitialized: true }));
    } else {
      const interimQuery = yield select(getInterimQuery, id);
      if (interimQuery) {
        yield put(removeInterimQuery(id));
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

    if (code === AnalysisError.RESOURCE_NOT_FOUND) {
      errorCode = WidgetErrors.SAVED_QUERY_NOT_EXIST;
    }

    yield put(
      setWidgetState(id, {
        isInitialized: true,
        error: {
          message: body,
          code: errorCode,
        },
      })
    );
  } finally {
    yield put(setWidgetLoading(id, false));
  }
}
