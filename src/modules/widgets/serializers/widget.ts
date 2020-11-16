import { Widget, WidgetItem } from '../types';

export const serializeWidget = (widget: Widget): WidgetItem => ({
  settings: widget,
  isQueryPerforming: false,
});
