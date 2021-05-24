import React, { FC } from 'react';
import { Headline, BodyText } from '@keen.io/typography';

import { Container, Description } from './SettingsHeadline.styles';

type Props = {
  /** Title text */
  title: string;
  /** Settings description */
  description?: string;
};

const SettingsHeadline: FC<Props> = ({ title, description }) => (
  <Container>
    <Headline variant="h4">{title}</Headline>
    {description && (
      <Description>
        <BodyText variant="body3" fontWeight="normal">
          {description}
        </BodyText>
      </Description>
    )}
  </Container>
);

export default SettingsHeadline;
