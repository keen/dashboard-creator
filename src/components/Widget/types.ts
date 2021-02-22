import { WidgetType } from '../../types';

export type RenderOptions = {
  widgetType: WidgetType;
  widgetId: string;
  isEditorMode: boolean;
  isHoverActive: boolean;
  isHighlighted: boolean;
  isDetached: boolean;
  isFadeOut: boolean;
  title?: string;
  onRemoveWidget: () => void;
  onEditWidget: () => void;
};
