import React, { FC } from 'react';
import { Checkbox } from '@keen.io/ui-core';
import { BodyText } from '@keen.io/typography';

import { Connections, ConnectionItem } from './WidgetConnections.styles';

type Props = {
  connections: { title: string; id: string; isConnected: boolean }[];
  /** Update connection event handler */
  onUpdateConnection: (id: string, isConnected: boolean) => void;
};

const WidgetConnections: FC<Props> = ({ connections, onUpdateConnection }) => (
  <Connections role="list">
    {connections.map(({ title, id, isConnected }) => (
      <ConnectionItem
        key={id}
        role="listitem"
        onClick={() => onUpdateConnection(id, !isConnected)}
      >
        <Checkbox type="secondary" id={id} checked={isConnected} />
        <BodyText variant="body2">{title}</BodyText>
      </ConnectionItem>
    ))}
  </Connections>
);

export default WidgetConnections;
