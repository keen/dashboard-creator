import { createWidgetId } from '../../widgets/utils';
import { Widget } from '../../widgets';

const createWidgetsUniqueIds = (widgets: Widget[]) => {
  const uniqueIdMap = widgets.reduce((acc, widget) => {
    return {
      ...acc,
      [widget.id]: createWidgetId(),
    };
  }, {});

  return widgets.map((widget) => ({
    ...widget,
    ...('datePickerId' in widget && {
      datePickerId: uniqueIdMap[widget.datePickerId],
    }),
    ...('filterIds' in widget &&
      widget.filterIds.length && {
        filterIds: widget.filterIds.map((filterId) => uniqueIdMap[filterId]),
      }),
    id: uniqueIdMap[widget.id],
    settings: {
      ...widget.settings,
      ...('widgets' in widget.settings &&
        widget.settings.widgets.length && {
          widgets: widget.settings.widgets.map((id) => uniqueIdMap[id]),
        }),
    },
  })) as Widget[];
};

export default createWidgetsUniqueIds;
