import { WidgetSettings } from '@keen.io/widgets';
import { WidgetType } from '../../types';
import { DashboardSettings } from '../../modules/dashboards';
import { WidgetError } from '../../modules/widgets';

export type RenderOptions = {
  widgetType: WidgetType;
  widgetId: string;
  widgetSettings: WidgetSettings;
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
