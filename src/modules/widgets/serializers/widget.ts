import { Widget, WidgetItem } from '../types';

import { enhanceWidget } from '../utils';

export const serializeWidget = (
  widget: Widget,
  isConfigured = false
): WidgetItem => ({
  widget: enhanceWidget(widget),
  isConfigured,
  isActive: false,
  isInitialized: false,
  isLoading: false,
  isHighlighted: false,
  isDetached: false,
  isFadeOut: false,
  isTitleCover: false,
  error: null,
  data: null,
});
