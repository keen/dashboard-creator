import React, { FC, useCallback } from 'react';

type Props = {
  /** Widget drag event handler */
  onWidgetDrag: (widgetType: string) => void;
};

const Toolbar: FC<Props> = ({ onWidgetDrag }) => {
  const dragStartHandler = useCallback(
    (e: React.DragEvent<HTMLLIElement>) => {
      e.dataTransfer.setData('text/plain', '');
      const widgetType = e.currentTarget.getAttribute('data-widget-type');
      onWidgetDrag(widgetType);
    },
    [onWidgetDrag]
  );

  return (
    <ul>
      <li
        draggable
        unselectable="on"
        data-widget-type="visualization"
        onDragStart={dragStartHandler}
      >
        Chart
      </li>
      <li
        draggable
        unselectable="on"
        data-widget-type="text"
        onDragStart={dragStartHandler}
      >
        Text
      </li>
    </ul>
  );
};

export default Toolbar;
