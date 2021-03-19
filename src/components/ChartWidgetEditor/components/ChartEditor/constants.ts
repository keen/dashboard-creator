import { ChartEditorError } from './types';

export const CHART_EDITOR_ERRORS: Record<ChartEditorError, string> = {
  [ChartEditorError.CONFIGURATION]: 'chart_widget_editor.configuration_error',
  [ChartEditorError.WIDGET]: 'chart_widget_editor.widget_error',
};
