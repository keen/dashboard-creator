import React, { FC } from 'react';
import { IconType } from '@keen.io/icons';

import WidgetItem from '../WidgetItem';

type Props = {
  type: 'text' | 'visualization';
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
    <div
      draggable
      unselectable="on"
      data-widget-type={type}
      onDragStart={dragStartHandler}
      onDragEnd={dragEndHandler}
    >
      <WidgetItem icon={icon} text={text} />
    </div>
  );
};

export default DraggableItem;
