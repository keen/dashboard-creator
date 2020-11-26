export type GridPosition = { w: number; h: number; x: number; y: number };

export type WidgetsPosition = (GridPosition & { i: string })[];

export interface BaseWidget {
  id: string;
  position: GridPosition;
}

export interface ChartWidget extends BaseWidget {
  type: 'visualization';
  settings: {
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
  data: Widget;
  isQueryPerforming: boolean;
};

export type ReducerState = {
  items: Record<string, WidgetItem>;
};
