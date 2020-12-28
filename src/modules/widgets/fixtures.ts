import { WidgetItem } from './types';

export const widget: WidgetItem = {
  data: null,
  error: null,
  isConfigured: false,
  isInitialized: false,
  isLoading: false,
  widget: {
    id: '@widget/id',
    position: { x: 3, y: 2, w: 6, h: 2 },
    query: null,
    settings: {
      chartSettings: {},
      visualizationType: null,
      widgetSettings: {},
    },
    type: 'visualization',
  },
};