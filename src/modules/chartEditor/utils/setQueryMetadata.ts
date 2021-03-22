import { PickerWidgets } from '@keen.io/widget-picker';

import { DEFAULT_WIDGET_SETTINGS } from '../widgetSettings';

const pickProperties = (record: Record<string, any>, properties: string[]) => {
  const clearRecord = {
    ...record,
  };

  Object.keys(record).forEach((propertyName: string) => {
    if (!properties.includes(propertyName)) {
      delete clearRecord[propertyName];
    }
  });

  return clearRecord;
};

/**
 * Pick basic chart and widget settings that could used
 * as saved query metadata.
 *
 * @param widgetType - Type of a widget
 * @param chartSettings - widget settings
 * @param widgetSettings - chart settings
 * @return void
 *
 */
const setQueryVisualizationMetadata = (
  widgetType: Exclude<PickerWidgets, 'json'>,
  chartSettings: Record<string, any>,
  widgetSettings: Record<string, any>
) => {
  const {
    chartSettings: baseChartSettings,
    widgetSettings: baseWidgetSettings,
  } = DEFAULT_WIDGET_SETTINGS[widgetType];

  return {
    defaultChartSettings: pickProperties(chartSettings, baseChartSettings),
    defaultWidgetSettings: pickProperties(widgetSettings, baseWidgetSettings),
  };
};

export default setQueryVisualizationMetadata;
