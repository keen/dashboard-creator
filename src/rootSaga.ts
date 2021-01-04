import { all } from 'redux-saga/effects';

import { appSaga } from './modules/app';
import { widgetsSaga } from './modules/widgets';
import { dashboardsSaga } from './modules/dashboards';
import { chartEditorSaga } from './modules/chartEditor';

export default function* rootSaga() {
  yield all([appSaga(), dashboardsSaga(), widgetsSaga(), chartEditorSaga()]);
}
