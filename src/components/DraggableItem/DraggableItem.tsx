import React, { FC } from 'react';
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
  return (
    <Container
      onClick={onClick}
      draggable
      unselectable="on"
      data-icon-type={icon}
      data-widget-type={type}
      onDragStart={dragStartHandler}
      onDragEnd={dragEndHandler}
    >
      <WidgetItem icon={icon} text={text} />
    </Container>
  );
};

export default DraggableItem;
