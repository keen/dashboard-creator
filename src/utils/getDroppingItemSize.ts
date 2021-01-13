import { WidgetType } from '../types';

const getDroppingItemSize = (widgetType: WidgetType) => {
  const i = 'dropping-item';

  switch (widgetType) {
    case 'visualization':
      return { i, w: 3, h: 7, minW: 2, minH: 6 };
    case 'image':
      return { i, w: 3, h: 9, minW: 2, minH: 4 };
    default:
      return { i, w: 3, h: 3, minW: 2, minH: 1 };
  }
};

export default getDroppingItemSize;
