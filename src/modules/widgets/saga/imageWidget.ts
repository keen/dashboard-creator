import { put, select, take } from 'redux-saga/effects';

import { getWidget } from '../selectors';
import { appActions, appSelectors } from '../../app';
import { widgetsActions } from '../index';
import { dashboardsActions } from '../../dashboards';

/**
 * Flow responsible for image widget setup
 *
 * @param queryId - Saved query identifer
 * @return void
 *
 */
export function* selectImageWidget(widgetId: string) {
  yield put(appActions.showImagePicker());
  const action = yield take([
    widgetsActions.saveImage.type,
    appActions.hideImagePicker.type,
  ]);

  if (action.type === appActions.hideImagePicker.type) {
    const dashboardId = yield select(appSelectors.getActiveDashboard);
    yield put(
      dashboardsActions.removeWidgetFromDashboard({ dashboardId, widgetId })
    );
  } else {
    yield put(
      widgetsActions.setImageWidget({ id: widgetId, link: action.payload.link })
    );
    yield put(
      widgetsActions.setWidgetState({
        id: widgetId,
        widgetState: {
          isConfigured: true,
        },
      })
    );
    yield put(appActions.hideImagePicker());
    const dashboardId = yield select(appSelectors.getActiveDashboard);
    yield put(dashboardsActions.saveDashboard(dashboardId));
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
}: ReturnType<typeof widgetsActions.editImageWidget>) {
  const { id } = payload;

  const state = yield select();
  const widgetId = getWidget(state, id).widget.id;

  yield put(appActions.showImagePicker());
  const action = yield take([
    widgetsActions.saveImage.type,
    appActions.hideImagePicker.type,
  ]);

  if (action.type === widgetsActions.saveImage.type) {
    yield put(
      widgetsActions.setImageWidget({ id: widgetId, link: action.payload.link })
    );
    yield put(appActions.hideImagePicker());

    const dashboardId = yield select(appSelectors.getActiveDashboard);
    yield put(dashboardsActions.saveDashboard(dashboardId));
  }
}
