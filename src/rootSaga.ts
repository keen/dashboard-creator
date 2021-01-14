import { all } from 'redux-saga/effects';

import { appSaga } from './modules/app';
import { widgetsSaga } from './modules/widgets';
import { dashboardsSaga } from './modules/dashboards';
import { chartEditorSaga } from './modules/chartEditor';

export function* dashboardCreatorRootSaga() {
  yield all([appSaga(), dashboardsSaga(), widgetsSaga(), chartEditorSaga()]);
}

export function* publicDashboardRootSaga() {
  yield all([appSaga(), dashboardsSaga(), widgetsSaga()]);
}
