import { put, select, take } from 'redux-saga/effects';

import {
  editImageWidget as editImageWidgetAction,
  setWidgetState,
  setImageWidget,
} from '../actions';

import { getWidget } from '../selectors';

import { saveDashboard, removeWidgetFromDashboard } from '../../dashboards';

import {
  getActiveDashboard,
  showImagePicker,
  hideImagePicker,
  HIDE_IMAGE_PICKER,
} from '../../app';

import { SAVE_IMAGE } from '../constants';

/**
 * Flow responsible for image widget setup
 *
 * @param queryId - Saved query identifer
 * @return void
 *
 */
export function* selectImageWidget(widgetId: string) {
  yield put(showImagePicker());
  const action = yield take([SAVE_IMAGE, HIDE_IMAGE_PICKER]);

  if (action.type === HIDE_IMAGE_PICKER) {
    const dashboardId = yield select(getActiveDashboard);
    yield put(removeWidgetFromDashboard(dashboardId, widgetId));
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
 * Flow responsible for image widget edit
 *
 * @param widgetId - Widget identifier
 * @return void
 *
 */
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
