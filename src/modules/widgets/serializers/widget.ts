import { Widget, WidgetItem } from '../types';

export const serializeWidget = (widget: Widget): WidgetItem => ({
  data: widget,
  isQueryPerforming: false,
});
