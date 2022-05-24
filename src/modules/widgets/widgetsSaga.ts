import { takeEvery, takeLatest } from 'redux-saga/effects';

import {
  applyDatePickerModifiers,
  clearDatePickerModifiers,
  editDatePickerWidget,
  resetDatePickerWidgets,
  setDatePickerModifiers,
} from './saga/datePickerWidget';
import { editImageWidget } from './saga/imageWidget';
import { editInlineTextWidget, editTextWidget } from './saga/textWidget';

import { editChartWidget, initializeChartWidget } from './saga/chart';
import {
  applyFilterModifiers,
  editFilterWidget,
  resetFilterWidgets,
  setFilterWidget,
  unapplyFilterWidget,
} from './saga/filterWidget';

import { reinitializeWidgets } from './saga/reinitializeWidgets';
import { createWidget } from './saga/createWidget';
import { cloneWidget } from './saga/cloneWidget';
import { createNewChart } from './saga/chart/createNewChart';
import { initializeWidget } from './saga/initializeWidget';
import { clearInconsistentFiltersErrorFromWidgets } from './saga/clearInconsistentFiltersErrorFromWidgets';
import { widgetsActions } from './index';

export function* widgetsSaga() {
  yield takeLatest(widgetsActions.savedQueryUpdated.type, reinitializeWidgets);
  yield takeLatest(widgetsActions.createWidget.type, createWidget);
  yield takeLatest(widgetsActions.editChartWidget.type, editChartWidget);
  yield takeLatest(widgetsActions.editImageWidget.type, editImageWidget);
  yield takeLatest(widgetsActions.editTextWidget.type, editTextWidget);
  yield takeLatest(
    widgetsActions.editDatePickerWidget.type,
    editDatePickerWidget
  );
  yield takeLatest(
    widgetsActions.setDatePickerModifiers.type,
    setDatePickerModifiers
  );
  yield takeLatest(
    widgetsActions.applyDatePickerModifiers.type,
    applyDatePickerModifiers
  );
  yield takeLatest(
    widgetsActions.editInlineTextWidget.type,
    editInlineTextWidget
  );
  yield takeLatest(widgetsActions.cloneWidget.type, cloneWidget);
  yield takeLatest(
    widgetsActions.clearDatePickerModifiers.type,
    clearDatePickerModifiers
  );
  yield takeLatest(widgetsActions.editFilterWidget.type, editFilterWidget);
  yield takeLatest(widgetsActions.createNewChart.type, createNewChart);
  yield takeEvery(
    widgetsActions.resetDatePickerWidgets.type,
    resetDatePickerWidgets
  );
  yield takeEvery(widgetsActions.initializeWidget.type, initializeWidget);
  yield takeEvery(
    widgetsActions.initializeChartWidget.type,
    initializeChartWidget
  );
  yield takeEvery(widgetsActions.setFilterWidget.type, setFilterWidget);
  yield takeEvery(
    widgetsActions.applyFilterModifiers.type,
    applyFilterModifiers
  );
  yield takeEvery(
    widgetsActions.clearInconsistentFiltersError.type,
    clearInconsistentFiltersErrorFromWidgets
  );
  yield takeEvery(widgetsActions.resetFilterWidgets.type, resetFilterWidgets);
  yield takeEvery(widgetsActions.unapplyFilterWidget.type, unapplyFilterWidget);
}
