import { put, select, take } from 'redux-saga/effects';

import {
  editImageWidget as editImageWidgetAction,
  setWidgetState,
  setImageWidget,
} from '../actions';

import { getWidget } from '../selectors';

import { saveDashboard, removeWidgetFromDashboard } from '../../dashboards';

import { SAVE_IMAGE } from '../constants';
import { appActions, appSelectors } from '../../app';

/**
 * Flow responsible for image widget setup
 *
 * @param queryId - Saved query identifer
 * @return void
 *
 */
export function* selectImageWidget(widgetId: string) {
  yield put(appActions.showImagePicker());
  const action = yield take([SAVE_IMAGE, appActions.hideImagePicker.type]);

  if (action.type === appActions.hideImagePicker.type) {
    const dashboardId = yield select(appSelectors.getActiveDashboard);
    yield put(removeWidgetFromDashboard(dashboardId, widgetId));
  } else {
    yield put(setImageWidget(widgetId, action.payload.link));
    yield put(
      setWidgetState(widgetId, {
        isConfigured: true,
      })
    );
    yield put(appActions.hideImagePicker());
    const dashboardId = yield select(appSelectors.getActiveDashboard);
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

  yield put(appActions.showImagePicker());
  const action = yield take([SAVE_IMAGE, appActions.hideImagePicker.type]);

  if (action.type === SAVE_IMAGE) {
    yield put(setImageWidget(widgetId, action.payload.link));
    yield put(appActions.hideImagePicker());

    const dashboardId = yield select(appSelectors.getActiveDashboard);
    yield put(saveDashboard(dashboardId));
  }
}
