import { createWidgetId } from '../../widgets/utils';
import { Widget } from '../../widgets';

const createWidgetsUniqueIds = (widgets: Widget[]): Widget[] => {
  const uniqueIdMap = widgets.reduce((acc, widget) => {
    return {
      ...acc,
      [widget.id]: createWidgetId(),
    };
  }, {});

  return widgets.map((widget) => {
    const baseWidget = {
      ...widget,
      id: uniqueIdMap[widget.id],
    };

    if (widget.type === 'visualization') {
      return {
        ...baseWidget,
        ...('datePickerId' in widget && {
          datePickerId: uniqueIdMap[widget.datePickerId],
        }),
        ...('filterIds' in widget &&
          widget.filterIds.length && {
            filterIds: widget.filterIds.map(
              (filterId) => uniqueIdMap[filterId]
            ),
          }),
      } as Widget;
    } else {
      return {
        ...baseWidget,
        settings: {
          ...widget.settings,
          ...('widgets' in widget.settings &&
            widget.settings.widgets.length && {
              widgets: widget.settings.widgets.map((id) => uniqueIdMap[id]),
            }),
        },
      } as Widget;
    }
  });
};

export default createWidgetsUniqueIds;
