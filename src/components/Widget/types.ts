import { WidgetType } from '../../types';

export type RenderOptions = {
  widgetType: WidgetType;
  widgetId: string;
  isEditorMode: boolean;
  isHoverActive: boolean;
  onRemoveWidget: () => void;
};
