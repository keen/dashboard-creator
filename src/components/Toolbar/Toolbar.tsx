import React, { FC, useCallback, useRef } from 'react';
import ReactDOM from 'react-dom';

import { Container } from './Toolbar.styles';

import ChartDragGhost from '../ChartDragGhost';

type Props = {
  /** Widget drag event handler */
  onWidgetDrag: (widgetType: string) => void;
};

const Toolbar: FC<Props> = ({ onWidgetDrag }) => {
  const dragGhostElement = useRef<HTMLDivElement>(null);
  const dragEndHandler = useCallback(() => {
    if (dragGhostElement.current) dragGhostElement.current.remove();
  }, []);

  const dragStartHandler = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.dataTransfer.setData('text/plain', '');
      const widgetType = e.currentTarget.getAttribute('data-widget-type');
      const element = document.createElement('div');

      dragGhostElement.current = element;
      ReactDOM.render(<ChartDragGhost />, element);

      document.body.appendChild(element);
      e.dataTransfer.setDragImage(element, 0, 0);

      onWidgetDrag(widgetType);
    },
    [onWidgetDrag]
  );

  return (
    <Container>
      <div
        draggable
        unselectable="on"
        data-widget-type="visualization"
        onDragStart={dragStartHandler}
        onDragEnd={dragEndHandler}
      >
        Chart
      </div>
      <div
        draggable
        unselectable="on"
        data-widget-type="text"
        onDragStart={dragStartHandler}
        onDragEnd={dragEndHandler}
      >
        Text
      </div>
    </Container>
  );
};

export default Toolbar;
