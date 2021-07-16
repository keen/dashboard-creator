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
  maxW?: number;
  maxH?: number;
};

export type WidgetsPosition = (GridPosition & { i: string })[];

export type FilterSettings = {
  propertyName: string;
  operator: string;
  propertyValue: string | string[];
};

export type VisualizationSettings = {
  visualizationType: PickerWidgets;
  chartSettings: Record<string, any>;
  widgetSettings: Record<string, any>;
};

export interface BaseWidget {
  id: string;
  position: GridPosition;
}

export interface ChartWidget extends BaseWidget {
  type: 'visualization';
  query: string | Query;
  datePickerId?: string;
  filterIds?: string[];
  settings: VisualizationSettings;
}

export interface TextWidget extends BaseWidget {
  type: 'text';
  settings: {
    content: RawDraftContentState;
    textAlignment: 'left' | 'center' | 'right';
  };
}

export interface ImageWidget extends BaseWidget {
  type: 'image';
  settings: {
    link: string;
  };
}

export interface DatePickerWidget extends BaseWidget {
  type: 'date-picker';
  settings: {
    widgets: string[];
    name: string;
  };
}

export interface FilterWidget extends BaseWidget {
  type: 'filter';
  settings: {
    widgets: string[];
    eventStream: string | null;
    targetProperty: string | null;
    name: string;
    filter: FilterSettings;
  };
}

export type Widget =
  | ChartWidget
  | TextWidget
  | ImageWidget
  | DatePickerWidget
  | FilterWidget;

export enum WidgetErrors {
  INCONSISTENT_FILTER = 'INCONSISTENT_FILTER',
  DETACHED_QUERY = 'DETACHED_QUERY',
  CANNOT_INITIALIZE = 'CANNOT_INITIALIZE',
}

export type WidgetError = {
  title?: string;
  message: string;
  code?: WidgetErrors;
};

export type WidgetItem<T = Widget> = {
  widget: T;
  isActive: boolean;
  isConfigured: boolean;
  isInitialized: boolean;
  isLoading: boolean;
  isHighlighted: boolean;
  isDetached: boolean;
  isFadeOut: boolean;
  isTitleCover: boolean;
  error: WidgetError | null;
  data: Record<string, any>;
};
