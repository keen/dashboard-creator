import { all } from 'redux-saga/effects';

import { appSaga } from './modules/app';
import { dashboardsSaga } from './modules/dashboards';
import { thumbnailsSaga } from './modules/thumbnails';

export default function* rootSaga() {
  yield all([appSaga(), dashboardsSaga(), thumbnailsSaga()]);
}
