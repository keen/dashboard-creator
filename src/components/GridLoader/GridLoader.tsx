import React from 'react';
import { Loader } from '@keen.io/ui-core';

import { Container } from './GridLoader.styles';

const GridLoader = () => (
  <Container>
    <Loader width={40} height={40} />
  </Container>
);

export default GridLoader;
