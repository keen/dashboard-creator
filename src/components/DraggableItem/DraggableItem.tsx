import React, { FC } from 'react';
import { IconType } from '@keen.io/icons';

import { Container } from './DraggableItem.styles';

import WidgetItem from '../WidgetItem';

import { WidgetType } from '../../types';

type Props = {
  type: WidgetType;
  icon?: IconType;
  text: string;
  dragStartHandler: (e: React.DragEvent<HTMLDivElement>) => void;
  dragEndHandler: () => void;
};

const DraggableItem: FC<Props> = ({
  type,
  icon,
  text,
  dragStartHandler,
  dragEndHandler,
}) => {
  return (
    <Container
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
