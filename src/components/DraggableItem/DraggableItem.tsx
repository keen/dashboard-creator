import React, { FC, useState } from 'react';
import { IconType } from '@keen.io/icons';

import { Container } from './DraggableItem.styles';
import WidgetItem from '../WidgetItem';

import { WidgetType } from '../../types';

type Props = {
  /** Widget type */
  type: WidgetType;
  /** Text used inside component */
  text: string;
  /** Click event handler */
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  /** Drag start event handler */
  dragStartHandler: (e: React.DragEvent<HTMLDivElement>) => void;
  /** Drag stop event handler */
  dragEndHandler: () => void;
  /** Icon type */
  icon?: IconType;
};

const DraggableItem: FC<Props> = ({
  type,
  icon,
  text,
  onClick,
  dragStartHandler,
  dragEndHandler,
}) => {
  const [isDragged, setElementDrag] = useState(false);

  return (
    <Container
      isDragged={isDragged}
      onClick={onClick}
      onMouseDown={() => setElementDrag(true)}
      onMouseUp={() => setElementDrag(false)}
      draggable
      unselectable="on"
      data-icon-type={icon}
      data-widget-type={type}
      onDragStart={dragStartHandler}
      onDragEnd={() => {
        setElementDrag(false);
        dragEndHandler();
      }}
    >
      <WidgetItem icon={icon} text={text} />
    </Container>
  );
};

export default DraggableItem;
