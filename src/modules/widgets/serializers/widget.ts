import { Widget, WidgetItem } from '../types';

export const serializeWidget = (
  widget: Widget,
  isConfigured = false
): WidgetItem => ({
  widget,
  isConfigured,
  isInitialized: false,
  isLoading: false,
  isHighlighted: false,
  isFadeOut: false,
  isTitleCover: false,
  error: null,
  data: null,
});
