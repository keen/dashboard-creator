import { WidgetItem, WidgetsPosition } from './types';

export const reduceWidgetsPosition = (
  items: Record<string, WidgetItem>,
  gridPositions: WidgetsPosition
) =>
  gridPositions.reduce((acc, position) => {
    const { i: id, x, y, w, h } = position;
    const item = items[id];

    return {
      ...acc,
      [id]: {
        ...item,
        widget: {
          ...item.widget,
          position: { w, h, x, y },
        },
      },
    };
  }, {});
