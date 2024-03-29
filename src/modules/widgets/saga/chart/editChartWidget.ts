import { call, getContext, put, select } from 'redux-saga/effects';

import { chartEditorActions } from '../../../chartEditor';
import { getWidget } from '../../selectors';

import { checkStreamsConsistency } from './checkStreamsConsistency';
import { editChart } from './editChart';

import { NOTIFICATION_MANAGER, TRANSLATIONS } from '../../../../constants';
import { WidgetErrors } from '../../types';
import { widgetsActions } from '../../index';

/**
 * Flow responsible for editing chart widget.
 *
 * @param widgetId - Widget identifer
 * @return void
 *
 */
export function* editChartWidget({
  payload,
}: ReturnType<typeof widgetsActions.editChartWidget>) {
  const { id } = payload;

  const state = yield select();
  const widgetItem = getWidget(state, id);

  const {
    data: { query },
  } = widgetItem;

  yield put(chartEditorActions.openEditor());

  const { isEditable, missingCollections } = yield call(
    checkStreamsConsistency,
    query
  );

  if (!isEditable) {
    yield put(chartEditorActions.setLoading(false));
    const notificationManager = yield getContext(NOTIFICATION_MANAGER);
    yield put(chartEditorActions.closeEditor());
    yield notificationManager.showNotification({
      type: 'error',
      translateMessage: true,
      message: 'notifications.not_existing_stream',
      autoDismiss: false,
      showDismissButton: true,
    });

    const i18n = yield getContext(TRANSLATIONS);
    const errorCode = WidgetErrors.STREAM_NOT_EXIST;
    const errorMessage = i18n.t('widget_errors.stream_not_found', {
      stream: missingCollections.join(', '),
    });

    yield put(
      widgetsActions.setWidgetState({
        id,
        widgetState: {
          isInitialized: true,
          error: {
            message: errorMessage,
            code: errorCode,
          },
        },
      })
    );
  } else {
    yield call(editChart, id, widgetItem);
  }
}
