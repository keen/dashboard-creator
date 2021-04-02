import React, { FC } from 'react';
import { Loader } from '@keen.io/ui-core';
import { BodyText } from '@keen.io/typography';
import { colors } from '@keen.io/colors';

import { Container, Wrapper } from './TimezoneLoader.styles';

type Props = {
  /** Loader message*/
  message: string;
};

const TimezoneLoader: FC<Props> = ({ message }) => (
  <Container>
    <Loader width={18} height={18} />
    <Wrapper>
      <BodyText variant="body2" color={colors.blue[500]}>
        {message}
      </BodyText>
    </Wrapper>
  </Container>
);

export default TimezoneLoader;
