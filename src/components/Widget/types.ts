import { WidgetType } from '../../types';
import { DashboardSettings } from '../../modules/dashboards';
import { WidgetError } from '../../modules/widgets';
import { VisualizationSettings } from '../../modules/widgets/types';

export type RenderOptions = {
  widgetType: WidgetType;
  widgetId: string;
  visualizationSettings: VisualizationSettings;
  isEditorMode: boolean;
  isHoverActive: boolean;
  isHighlighted: boolean;
  isDetached: boolean;
  isFadeOut: boolean;
  title?: string;
  error?: WidgetError;
  onRemoveWidget: () => void;
  onEditWidget: () => void;
  dashboardSettings?: Pick<DashboardSettings, 'tiles'>;
};
