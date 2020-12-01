import { all } from 'redux-saga/effects';

import { appSaga } from './modules/app';
import { widgetsSaga } from './modules/widgets';
import { dashboardsSaga } from './modules/dashboards';
import { thumbnailsSaga } from './modules/thumbnails';

export default function* rootSaga() {
  yield all([appSaga(), dashboardsSaga(), widgetsSaga(), thumbnailsSaga()]);
}
