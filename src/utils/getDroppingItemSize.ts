import { WidgetType } from '../types';

const getDroppingItemSize = (widgetType: WidgetType) => {
  const i = 'dropping-item';

  switch (widgetType) {
    case 'date-picker':
      return { i, w: 4, h: 2, minW: 4, minH: 2 };
    case 'visualization':
      return { i, w: 4, h: 7, minW: 2, minH: 6 };
    case 'image':
      return { i, w: 4, h: 9, minW: 2, minH: 4 };
    case 'text':
      return { i, w: 2, h: 2, minW: 2, minH: 1 };
    default:
      return { i, w: 3, h: 3, minW: 2, minH: 1 };
  }
};

export default getDroppingItemSize;
