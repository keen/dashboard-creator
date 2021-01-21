import { RawDraftContentState } from 'draft-js';
import { Query } from '@keen.io/query';
import { PickerWidgets } from '@keen.io/widget-picker';

export type ReducerState = {
  items: Record<string, WidgetItem>;
};

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
    visualizationType: PickerWidgets;
    chartSettings: Record<string, any>;
    widgetSettings: Record<string, any>;
  };
}

export interface TextWidget extends BaseWidget {
  type: 'text';
  settings: {
    content: RawDraftContentState;
  };
}

export interface ImageWidget extends BaseWidget {
  type: 'image';
  settings: {
    link: string;
  };
}

export type Widget = ChartWidget | TextWidget | ImageWidget;

export type WidgetError = {
  title?: string;
  message: string;
};

export type WidgetItem = {
  widget: Widget;
  isConfigured: boolean;
  isInitialized: boolean;
  isLoading: boolean;
  error: WidgetError | null;
  data: Record<string, any>;
};
