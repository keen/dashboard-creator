# Dashboard Model

This document describes the dashboard model and dependencies between different types of the widgets.

## Dashboard

```typescript
type Dashboard = {
  /** Model version */
  version: string;
  /** Collection of widgets */
  widgets: Widget[];
  /* Base theme used for all chart widgets */
  baseTheme?: Partial<Theme>;
};
```

##### Widget

Specific widget model definiton.

```typescript
type Widget =
  | ChartWidget
  | TextWidget
  | ImageWidget
  | DatePickerWidget
  | FilterWidget;
```

## Dashboard Metadata

Metadata is used to provide basic information about the dashboard like its title, tags and last modification date.

```typescript
type MetaData = {
  /* Dashboard identifier */
  id: string;
  /* Dashboard title */
  title: null | string;
  /* Number of widgets used on dashboard */
  widgets: number;
  /* Number of queries used on dashboard */
  queries: number;
  /* Collection of saved queries used on dashboard */
  savedQueries: string[];
  /* Tags used for filtering on dashboards list */
  tags: string[];
  /* Timestamp representing last modification date */
  lastModificationDate: number;
  /* Public indicator */
  isPublic: boolean;
  /* Public access key name connected with dashboard  */
  publicAccessKey: null | string;
};
```

## Widgets

### Base Types

##### GridPosition

Defines the widget position on grid layout.

```typescript
type GridPosition = {
  w: number;
  h: number;
  x: number;
  y: number;
  /* Minimum height - prevents widget resizing below defined threshold */
  minH?: number;
  /* Minimum width - prevents widget resizing below defined threshold */
  minW?: number;
};
```

##### BaseWidget

Basic interface used for all widget types.

```typescript
interface BaseWidget {
  id: string;
  position: GridPosition;
}
```

##### Widgets

Possible visualization widget types.

```typescript
type Widgets = 'bar' | 'line' | 'area' | 'pie' | 'donut' | 'gauge' | 'metric' | 'funnel' | 'choropleth' | 'bubble' | 'heatmap' | 'table';
```

### Chart Widget

Definition of chart widget - responsible for visualizing data.

```typescript
interface ChartWidget extends BaseWidget {
  type: 'visualization';
  /* Saved query name or query JSON definition */
  query: string | Query;
  /* Identifier of connected date picker widget */
  datePickerId: string | null;
  /* Identifiers of connected filter widgets */
  filterIds?: string[];
  /* DataViz settings */
  settings: {
    visualizationType: Widgets;
    chartSettings: Record<string, any>;
    widgetSettings: Record<string, any>;
  };
}
```

### Image Widget

Definition of image widget - responsible for displaying image on dashboard.

```typescript
interface ImageWidget extends BaseWidget {
  type: 'image';
  settings: {
    /* Image resource url */
    link: string;
  };
}
```

### DatePicker Widget

Definition of date picker widget - responsible for applying unified date range for connected chart widgets.

```typescript
interface DatePickerWidget extends BaseWidget {
  type: 'date-picker';
  settings: {
    /* Identifiers of connected chart widgets */
    widgets: string[];
  };
}
```

### Filter Widget

Definition of filter widget - responsible for applying additional query filters for connected chart widgets.

```typescript
interface FilterWidget extends BaseWidget {
  type: 'filter';
  settings: {
    /* Identifiers of connected chart widgets */
    widgets: string[];
    /* Event stream used for filter */
    eventStream: string | null;
    /* Target property from event stream  */
    targetProperty: string | null;
  };
}
```

### Text Widget

Definition of text widget - responsible for displaying text messages on dashboard. For reference of `RawDraftContentState` type check `text-widget.json` file.

```typescript
interface TextWidget extends BaseWidget {
  type: 'text';
  settings: {
    content: RawDraftContentState;
    textAlignment: 'left' | 'center' | 'right';
  };
}
```
