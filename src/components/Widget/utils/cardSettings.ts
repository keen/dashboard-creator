import { WidgetType } from '../../../types';
import { VisualizationSettings } from '../../../modules/widgets';

export const cardSettings = (
  widgetType: WidgetType,
  visualizationSettings: VisualizationSettings
) => {
  if (widgetType === 'visualization' && visualizationSettings) {
    const { widgetSettings } = visualizationSettings;

    if ('card' in widgetSettings) {
      return widgetSettings.card.enabled;
    }
  }

  return true;
};
