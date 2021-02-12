import React, { FC } from 'react';

import { Cover, Title } from './WidgetCover.styles';

type Props = {
  /** Highlighted mode indicator */
  isHighlighted?: boolean;
  /** Title for cover */
  title?: string;
};

const WidgetCover: FC<Props> = ({ isHighlighted, title }) => (
  <Cover isHighlighted={isHighlighted}>{title && <Title>{title}</Title>}</Cover>
);

export default WidgetCover;
