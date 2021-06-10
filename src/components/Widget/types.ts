import { WidgetType } from '../../types';
import { DashboardSettings } from '../../modules/dashboards';

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
  dashboardSettings?: Pick<DashboardSettings, 'tiles'>;
};
