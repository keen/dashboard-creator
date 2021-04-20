import { all } from 'redux-saga/effects';

import { appSaga } from './modules/app';
import { widgetsSaga } from './modules/widgets';
import { dashboardsSaga } from './modules/dashboards';
import { chartEditorSaga } from './modules/chartEditor';
import { datePickerSaga } from './modules/datePicker';
import { filterSaga } from './modules/filter';
import { timezoneSaga } from './modules/timezone';

export const createRootSaga = (editPrivileges = false) => {
  const sagaFlows = [
    appSaga(),
    dashboardsSaga(),
    widgetsSaga(),
    filterSaga(),
    timezoneSaga(),
  ];

  if (editPrivileges) {
    sagaFlows.push(chartEditorSaga(), datePickerSaga());
  }

  return function* () {
    yield all(sagaFlows);
  };
};
