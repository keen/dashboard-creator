import {
  editChartWidget,
  editImageWidget,
  editInlineTextWidget,
  editTextWidget,
  initializeChartWidget,
  initializeWidget,
  setWidgetInitialization,
  savedQueryUpdated,
  cloneWidget,
  editDatePickerWidget,
  applyDatePickerModifiers,
  clearDatePickerModifiers,
  setDatePickerModifiers,
  resetDatePickerWidgets,
  editFilterWidget,
  setFilterWidget,
  unapplyFilterWidget,
  applyFilterModifiers,
  clearInconsistentFiltersError,
  resetFilterWidgets,
  createNewChart,
  saveImage,
} from './actions';
import { widgetsSelectors } from './selectors';
import { serializeWidget } from './serializers';
import { widgetsSaga } from './widgetsSaga';
import { createWidgetId } from './utils';
import {
  Widget,
  WidgetError,
  WidgetErrors,
  GridPosition,
  WidgetsPosition,
  ChartWidget,
  DatePickerWidget,
  TextWidget,
  FilterWidget,
  ImageWidget,
  WidgetItem,
  VisualizationSettings,
  FilterSettings,
} from './types';
import widgetsSlice from './reducer';

const widgetsReducer = widgetsSlice.reducer;

const widgetsActions = {
  ...widgetsSlice.actions,
  editChartWidget,
  editImageWidget,
  editTextWidget,
  editInlineTextWidget,
  applyDatePickerModifiers,
  setDatePickerModifiers,
  clearDatePickerModifiers,
  editDatePickerWidget,
  resetDatePickerWidgets,
  initializeWidget,
  initializeChartWidget,
  cloneWidget,
  saveImage,
  createNewChart,
  savedQueryUpdated,
  setWidgetInitialization,
  editFilterWidget,
  setFilterWidget,
  unapplyFilterWidget,
  applyFilterModifiers,
  clearInconsistentFiltersError,
  resetFilterWidgets,
};

export type {
  Widget,
  WidgetItem,
  WidgetError,
  GridPosition,
  WidgetsPosition,
  ChartWidget,
  DatePickerWidget,
  ImageWidget,
  TextWidget,
  FilterWidget,
  FilterSettings,
  VisualizationSettings,
};

export {
  WidgetErrors,
  widgetsReducer,
  widgetsSaga,
  widgetsActions,
  createWidgetId,
  serializeWidget,
  widgetsSelectors,
};
