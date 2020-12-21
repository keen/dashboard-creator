import { WidgetType } from '../types';

const getDroppingItemSize = (widgetType: WidgetType) => {
  const i = 'dropping-item';

  return widgetType === 'visualization'
    ? { i, w: 3, h: 7, minW: 2, minH: 6 }
    : { i, w: 3, h: 3, minW: 2, minH: 1 };
};

export default getDroppingItemSize;
