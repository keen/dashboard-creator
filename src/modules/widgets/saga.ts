import {
  takeLatest,
  takeEvery,
  put,
  select,
  take,
  fork,
  call,
  all,
  getContext,
} from 'redux-saga/effects';
import { SET_QUERY_EVENT, SET_CHART_SETTINGS } from '@keen.io/query-creator';
import { getAvailableWidgets } from '@keen.io/widget-picker';

import {
  createWidget as createWidgetAction,
  initializeWidget as initializeWidgetAction,
  initializeChartWidget as initializeChartWidgetAction,
  editChartWidget as editChartWidgetAction,
  editImageWidget as editImageWidgetAction,
  editInlineTextWidget as editInlineTextWidgetAction,
  editTextWidget as editTextWidgetAction,
  setWidgetLoading,
  setWidgetState,
  finishChartWidgetConfiguration,
  setImageWidget,
  setTextWidget,
  savedQueryUpdated,
} from './actions';

import { getWidgetSettings, getWidget } from './selectors';

import {
  removeWidgetFromDashboard,
  saveDashboard,
  getDashboardSettings,
  ADD_WIDGET_TO_DASHBOARD,
} from '../dashboards';
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
} from '../chartEditor';

import {
  openEditor as openTextEditor,
  closeEditor as closeTextEditor,
  setTextAlignment,
  setEditorContent,
  APPLY_TEXT_EDITOR_SETTINGS,
  CLOSE_EDITOR as CLOSE_TEXT_EDITOR,
} from '../textEditor';

import {
  updateSaveQuery,
  SELECT_SAVED_QUERY,
  CREATE_QUERY,
  SAVE_IMAGE,
  SavedQuery,
} from '../queries';
import {
  getActiveDashboard,
  showQueryPicker,
  hideQueryPicker,
  showImagePicker,
  hideImagePicker,
  HIDE_QUERY_PICKER,
  HIDE_IMAGE_PICKER,
} from '../app';

import {
  CREATE_WIDGET,
  EDIT_INLINE_TEXT_WIDGET,
  EDIT_TEXT_WIDGET,
  EDIT_CHART_WIDGET,
  EDIT_IMAGE_WIDGET,
  INITIALIZE_WIDGET,
  INITIALIZE_CHART_WIDGET,
  SAVED_QUERY_UPDATED,
} from './constants';
import {
  PUBSUB,
  KEEN_ANALYSIS,
  NOTIFICATION_MANAGER,
  I18N,
} from '../../constants';

import { ChartWidget, WidgetItem } from './types';

export function* initializeChartWidget({
  payload,
}: ReturnType<typeof initializeChartWidgetAction>) {
  const { id } = payload;
  const {
    query,
    settings: { visualizationType },
  } = yield select(getWidgetSettings, id);

  try {
    const requestBody =
      typeof query === 'string' ? { savedQueryName: query } : query;
    const keenAnalysis = yield getContext(KEEN_ANALYSIS);

    yield put(setWidgetLoading(id, true));

    let analysisResult = yield keenAnalysis.query(requestBody);

    /** Funnel analysis do not return query settings in response */
    if (query !== 'string' && query.analysis_type === 'funnel') {
      analysisResult = {
        ...analysisResult,
        query,
      };
    }

    const { query: querySettings } = analysisResult;

    const isDetachedQuery = !getAvailableWidgets(querySettings).includes(
      visualizationType
    );
    let widgetState: Partial<WidgetItem> = {
      isInitialized: true,
      data: analysisResult,
    };

    if (isDetachedQuery) {
      const i18n = yield getContext(I18N);
      const error = {
        title: i18n.t('widget_errors.detached_query_title', {
          chart: visualizationType,
        }),
        message: i18n.t('widget_errors.detached_query_message'),
      };

      widgetState = {
        ...widgetState,
        error,
      };
    }

    yield put(setWidgetState(id, widgetState));
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
 * Flow responsible for re-initializing widgets after updating saved query.
 *
 * @param queryId - Saved query identifer
 * @return void
 *
 */
export function* reinitializeWidgets({
  payload,
}: ReturnType<typeof savedQueryUpdated>) {
  const { widgetId, queryId } = payload;
  const dashboardId = yield select(getActiveDashboard);

  const { widgets } = yield select(getDashboardSettings, dashboardId);
  const widgetState: Partial<WidgetItem> = {
    isInitialized: false,
    error: null,
    data: null,
  };

  const widgetsSettings = yield all(
    widgets.map((id: string) => select(getWidgetSettings, id))
  );

  const widgetsToUpdate = widgetsSettings.filter(
    ({ id, type, query }) =>
      id !== widgetId && type === 'visualization' && query === queryId
  );

  yield all(
    widgetsToUpdate.map(({ id }) => put(setWidgetState(id, widgetState)))
  );
  yield all(
    widgetsToUpdate.map(({ id }) => put(initializeChartWidgetAction(id)))
  );
}

export function* initializeWidget({
  payload,
}: ReturnType<typeof initializeWidgetAction>) {
  const { id } = payload;
  const { type } = yield select(getWidgetSettings, id);
  if (type === 'visualization') {
    yield put(initializeChartWidgetAction(id));
  } else {
    yield put(
      setWidgetState(id, {
        isConfigured: true,
        isInitialized: true,
      })
    );
  }
}

function* cancelWidgetConfiguration(widgetId: string) {
  const dashboardId = yield select(getActiveDashboard);
  yield put(removeWidgetFromDashboard(dashboardId, widgetId));
}

/**
 * Flow responsible for creating ad-hoc query for chart widget.
 *
 * @param widgetId - Widget identifer
 * @return void
 *
 */
export function* createQueryForWidget(widgetId: string) {
  yield put(openEditor());
  const action = yield take([CLOSE_CHART_EDITOR, APPLY_CONFIGURATION]);

  if (action.type === CLOSE_CHART_EDITOR) {
    yield* cancelWidgetConfiguration(widgetId);
  } else {
    const {
      querySettings,
      visualization: { type, chartSettings, widgetSettings },
    } = yield select(getChartEditor);

    yield put(
      finishChartWidgetConfiguration(
        widgetId,
        querySettings,
        type,
        chartSettings,
        widgetSettings
      )
    );

    yield put(closeEditor());
    yield take(EDITOR_UNMOUNTED);
    yield put(resetEditor());

    yield put(initializeChartWidgetAction(widgetId));

    const dashboardId = yield select(getActiveDashboard);
    yield put(saveDashboard(dashboardId));
  }
}

export function* selectImageWidget(widgetId: string) {
  yield put(showImagePicker());
  const action = yield take([SAVE_IMAGE, HIDE_IMAGE_PICKER]);

  if (action.type === HIDE_IMAGE_PICKER) {
    yield* cancelWidgetConfiguration(widgetId);
  } else {
    yield put(setImageWidget(widgetId, action.payload.link));
    yield put(
      setWidgetState(widgetId, {
        isConfigured: true,
      })
    );
    yield put(hideImagePicker());
    const dashboardId = yield select(getActiveDashboard);
    yield put(saveDashboard(dashboardId));
  }
}

/**
 * Initial flow for creating chart widget.
 *
 * @param widgetId - Widget identifer
 * @return void
 *
 */
export function* selectQueryForWidget(widgetId: string) {
  yield put(showQueryPicker());
  const action = yield take([
    SELECT_SAVED_QUERY,
    CREATE_QUERY,
    HIDE_QUERY_PICKER,
  ]);

  if (action.type === HIDE_QUERY_PICKER) {
    yield* cancelWidgetConfiguration(widgetId);
  } else if (action.type === CREATE_QUERY) {
    yield put(hideQueryPicker());
    yield call(createQueryForWidget, widgetId);
  } else if (action.type === SELECT_SAVED_QUERY) {
    const {
      query: {
        id: queryId,
        visualization: { type: widgetType, chartSettings, widgetSettings },
      },
    } = action.payload as { query: SavedQuery };

    yield put(hideQueryPicker());
    yield put(
      finishChartWidgetConfiguration(
        widgetId,
        queryId,
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

export function* editImageWidget({
  payload,
}: ReturnType<typeof editImageWidgetAction>) {
  const { id } = payload;

  const state = yield select();
  const widgetId = getWidget(state, id).widget.id;

  yield put(showImagePicker());
  const action = yield take([SAVE_IMAGE, HIDE_IMAGE_PICKER]);

  if (action.type === SAVE_IMAGE) {
    yield put(setImageWidget(widgetId, action.payload.link));
    yield put(hideImagePicker());

    const dashboardId = yield select(getActiveDashboard);
    yield put(saveDashboard(dashboardId));
  }
}

/**
 * Flow responsible for creating text widget.
 *
 * @param widgetId - Widget identifer
 * @return void
 *
 */
export function* createTextWidget(widgetId: string) {
  yield put(
    setTextWidget(widgetId, {
      content: { blocks: [], entityMap: {} },
    })
  );
  yield put(
    setWidgetState(widgetId, {
      isConfigured: true,
      isInitialized: true,
    })
  );
}

export function* editTextWidget({
  payload,
}: ReturnType<typeof editTextWidgetAction>) {
  const { id } = payload;
  const {
    settings: { content, textAlignment },
  } = yield select(getWidgetSettings, id);

  yield put(setEditorContent(content));
  yield put(setTextAlignment(textAlignment));

  yield put(openTextEditor());
  yield put(
    setWidgetState(id, {
      isInitialized: false,
    })
  );

  const action = yield take([APPLY_TEXT_EDITOR_SETTINGS, CLOSE_TEXT_EDITOR]);

  if (action.type === APPLY_TEXT_EDITOR_SETTINGS) {
    const {
      content: updatedContent,
      textAlignment: updatedAlignment,
    } = action.payload;
    yield put(
      setTextWidget(id, {
        content: updatedContent,
        textAlignment: updatedAlignment,
      })
    );

    const dashboardId = yield select(getActiveDashboard);
    yield put(saveDashboard(dashboardId));

    yield put(closeTextEditor());
  }

  yield put(
    setWidgetState(id, {
      isInitialized: true,
    })
  );
}

export function* editInlineTextWidget({
  payload,
}: ReturnType<typeof editInlineTextWidgetAction>) {
  const { id, content } = payload;
  yield put(setTextWidget(id, { content }));

  const dashboardId = yield select(getActiveDashboard);
  yield put(saveDashboard(dashboardId));
}

export function* createWidget({
  payload,
}: ReturnType<typeof createWidgetAction>) {
  const { id, widgetType } = payload;
  if (widgetType === 'image') {
    yield fork(selectImageWidget, id);
  } else if (widgetType === 'text') {
    yield fork(createTextWidget, id);
    yield take(ADD_WIDGET_TO_DASHBOARD);
    const dashboardId = yield select(getActiveDashboard);
    yield put(saveDashboard(dashboardId));
  } else {
    yield fork(selectQueryForWidget, id);
  }
}

export function* widgetsSaga() {
  yield takeLatest(SAVED_QUERY_UPDATED, reinitializeWidgets);
  yield takeLatest(CREATE_WIDGET, createWidget);
  yield takeLatest(EDIT_CHART_WIDGET, editChartWidget);
  yield takeLatest(EDIT_IMAGE_WIDGET, editImageWidget);
  yield takeLatest(EDIT_TEXT_WIDGET, editTextWidget);
  yield takeLatest(EDIT_INLINE_TEXT_WIDGET, editInlineTextWidget);
  yield takeEvery(INITIALIZE_WIDGET, initializeWidget);
  yield takeEvery(INITIALIZE_CHART_WIDGET, initializeChartWidget);
}
