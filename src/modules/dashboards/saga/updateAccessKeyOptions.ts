import { RootState } from '../../../rootReducer';
import { select } from 'redux-saga/effects';
import { appSelectors } from '../../app';
import { getDashboardMeta } from '../selectors';
import { updateAccessKey } from './updateAccessKey';

export function* updateAccessKeyOptions() {
  const state: RootState = yield select();
  const dashboardId = yield select(appSelectors.getActiveDashboard);
  const { isPublic } = yield getDashboardMeta(state, dashboardId);

  if (isPublic) {
    yield updateAccessKey(dashboardId);
  }
}
