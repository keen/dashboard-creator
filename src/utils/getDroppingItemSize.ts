import { WidgetType } from '../types';

const getDroppingItemSize = (widgetType: WidgetType) => {
  const i = 'dropping-item';

  return widgetType === 'visualization' ? { i, w: 3, h: 7 } : { i, w: 3, h: 3 };
};

export default getDroppingItemSize;
