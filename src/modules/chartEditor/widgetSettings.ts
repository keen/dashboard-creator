import { PickerWidgets } from '@keen.io/widget-picker';

export const DEFAULT_WIDGET_SETTINGS: Record<
  Exclude<PickerWidgets, 'json'>,
  {
    chartSettings: string[];
    widgetSettings: string[];
  }
> = {
  bar: {
    chartSettings: ['layout', 'stackMode', 'groupMode'],
    widgetSettings: [],
  },
  line: {
    chartSettings: ['curve', 'stackMode', 'groupMode'],
    widgetSettings: [],
  },
  area: {
    chartSettings: ['curve', 'stackMode', 'groupMode'],
    widgetSettings: [],
  },
  gauge: {
    chartSettings: [],
    widgetSettings: [],
  },
  choropleth: {
    chartSettings: [],
    widgetSettings: ['geographicArea'],
  },
  pie: {
    chartSettings: [],
    widgetSettings: [],
  },
  donut: {
    chartSettings: [],
    widgetSettings: [],
  },
  heatmap: {
    chartSettings: [],
    widgetSettings: [],
  },
  bubble: {
    chartSettings: [],
    widgetSettings: [],
  },
  table: {
    chartSettings: [],
    widgetSettings: [],
  },
  funnel: {
    chartSettings: ['layout'],
    widgetSettings: [],
  },
  metric: {
    chartSettings: ['type', 'usePercentDifference'],
    widgetSettings: [],
  },
};
