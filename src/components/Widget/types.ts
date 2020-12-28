import { WidgetType } from '../../types';

export type RenderOptions = {
  widgetType: WidgetType;
  widgetId: string;
  disableInteractions: boolean;
  isHoverActive: boolean;
  onRemoveWidget: () => void;
};
