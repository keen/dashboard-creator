import { Widget, WidgetItem } from '../types';

export const serializeWidget = (
  widget: Widget,
  isConfigured = false
): WidgetItem => ({
  widget,
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
