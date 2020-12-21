import { Query } from '@keen.io/parser';

export type GridPosition = {
  w: number;
  h: number;
  x: number;
  y: number;
  minH?: number;
  minW?: number;
};

export type WidgetsPosition = (GridPosition & { i: string })[];

export interface BaseWidget {
  id: string;
  position: GridPosition;
}

export interface ChartWidget extends BaseWidget {
  type: 'visualization';
  query: string | Query;
  settings: {
    visualizationType: string;
    chartSettings: Record<string, any>;
    widgetSettings: Record<string, any>;
  };
}

export interface TextWidget extends BaseWidget {
  type: 'text';
  settings: {};
}

export type Widget = ChartWidget | TextWidget;

export type WidgetItem = {
  widget: Widget;
  isConfigured: boolean;
  isInitialized: boolean;
  isLoading: boolean;
  error: string;
  data: Record<string, any>;
};

export type ReducerState = {
  items: Record<string, WidgetItem>;
};
