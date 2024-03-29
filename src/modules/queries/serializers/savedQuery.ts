import { getAvailableWidgets } from '@keen.io/widget-picker';
import camelCase from 'camelcase-keys';
import { convertSecondsToHours } from '@keen.io/time-utils';

import {
  SavedQueryAPIResponse,
  SavedQuery,
  QueryVisualization,
} from '../types';

export const serializeSavedQuery = ({
  query_name: queryName,
  query,
  metadata,
  refresh_rate,
}: SavedQueryAPIResponse): SavedQuery => {
  const baseProperties = {
    id: queryName,
    displayName: metadata?.display_name || queryName,
    settings: query,
    tags: metadata?.tags,
    cached: refresh_rate && convertSecondsToHours(refresh_rate),
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
      chartSettings: chartSettings
        ? camelCase(chartSettings, {
            deep: true,
            stopPaths: ['columns_names_mapping', 'format_value'],
          })
        : {},
      widgetSettings: widgetSettings
        ? camelCase(widgetSettings, {
            deep: true,
          })
        : {},
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
