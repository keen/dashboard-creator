import { getAvailableWidgets } from '@keen.io/widget-picker';
import camelCase from 'camelcase-keys';

import {
  SavedQueryAPIResponse,
  SavedQuery,
  QueryVisualization,
} from '../types';

export const serializeSavedQuery = ({
  query_name: queryName,
  query,
  metadata,
}: SavedQueryAPIResponse): SavedQuery => {
  const baseProperties = {
    id: queryName,
    displayName: metadata?.display_name || queryName,
    settings: query,
  };

  let visualization = {} as QueryVisualization;

  if (metadata?.visualization?.type) {
    const {
      type,
      chart_settings: chartSettings,
      widget_settings: widgetSettings,
    } = metadata.visualization;

    visualization = {
      type,
      chartSettings: camelCase(chartSettings, {
        deep: true,
        stopPaths: ['columns_names_mapping', 'format_value'],
      }),
      widgetSettings: camelCase(widgetSettings, {
        deep: true,
      }),
    };
  } else {
    const [defaultWidget] = getAvailableWidgets(query);
    visualization = {
      type: defaultWidget,
      chartSettings: {},
      widgetSettings: {},
    };
  }

  return {
    ...baseProperties,
    visualization,
  };
};
