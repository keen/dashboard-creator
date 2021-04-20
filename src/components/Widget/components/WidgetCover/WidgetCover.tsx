import React, { FC } from 'react';

import { Cover, Title } from './WidgetCover.styles';

type Props = {
  /** Highlighted mode indicator */
  isHighlighted?: boolean;
  /** Detached mode indicator */
  isDetached?: boolean;
  /** Title for cover */
  title?: string;
};

const WidgetCover: FC<Props> = ({ isHighlighted, isDetached, title }) => (
  <Cover isHighlighted={isHighlighted} isDetached={isDetached}>
    {title && <Title>{title}</Title>}
  </Cover>
);

export default WidgetCover;
