import React, { FC } from 'react';
import { Badge } from '@keen.io/ui-core';

import {
  Container,
  Details,
  Title,
  Tag,
  Excerpt,
  Heading,
  ActionsContainer,
} from './Header.styles';

type Props = {
  /** Dashboard title */
  title: string;
  /** Excerpt message */
  excerpt: string;
  /** Children nodes */
  children: React.ReactNode;
};

const Header: FC<Props> = ({ title, excerpt, children }) => (
  <Container>
    <Heading>
      <Title>{title}</Title>
      <Details>
        <Excerpt>{excerpt}</Excerpt>
        <Tag>
          <Badge>test</Badge>
        </Tag>
      </Details>
    </Heading>
    <ActionsContainer>{children}</ActionsContainer>
  </Container>
);

export default Header;
