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
    case 'date-picker':
      return {
        ...widget,
        settings: {
          name: '',
          ...widget.settings,
        },
      };
    case 'filter':
      return {
        ...widget,
        settings: {
          name: widget.settings.targetProperty,
          ...widget.settings,
        },
      };
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
