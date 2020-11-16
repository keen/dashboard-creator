import React, { FC } from 'react';

import { Container } from './Widget.styles';

type Props = {
  /** Widget identifier */
  id: string;
};

const Widget: FC<Props> = ({ id }) => {
  return <Container>Widget {id}</Container>;
};

export default Widget;
