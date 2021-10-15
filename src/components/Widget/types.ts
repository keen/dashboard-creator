import { WidgetType } from '../../types';
import { DashboardSettings } from '../../modules/dashboards';
import { WidgetError } from '../../modules/widgets';

export type RenderOptions = {
  widgetType: WidgetType;
  widgetId: string;
  isEditorMode: boolean;
  isHoverActive: boolean;
  isHighlighted: boolean;
  isDetached: boolean;
  isFadeOut: boolean;
  isInitialized: boolean;
  isDragged: boolean;
  title?: string;
  cardEnabled?: boolean;
  error?: WidgetError;
  onRemoveWidget: () => void;
  onEditWidget: () => void;
  dashboardSettings?: Pick<DashboardSettings, 'tiles'>;
};
