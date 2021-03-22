import deepMerge from 'deepmerge';

import createHeadingSettings from './createHeadingSettings';

import { EditorWidgetSettings } from '../types';

/**
 * Creates widget settings for chart editor.
 *
 * @param widgetSettings - initial widget settings
 * @return widget settings
 *
 */
const createWidgetSettings = (
  widgetSettings: Record<string, any> = {}
): EditorWidgetSettings => {
  const baseSettings = {
    ...createHeadingSettings(),
  };

  return deepMerge(baseSettings, widgetSettings, {
    arrayMerge: (_target, source) => source,
  }) as EditorWidgetSettings;
};

export default createWidgetSettings;
