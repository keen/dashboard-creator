import { Widget } from '../types';

/**
 * Enhances widget model with properties. Used for widgets
 * backward compatibility,
 *
 * @param widget - Widget model
 * @return widget model with extended properties
 *
 */
export const enhanceWidget = (widget: Widget) => {
  switch (widget.type) {
    case 'visualization':
      return {
        filterIds: [],
        datePickerId: null,
        ...widget,
      };
    default:
      return widget;
  }
};
