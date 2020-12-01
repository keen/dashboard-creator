import React, { FC } from 'react';
import { Badge } from '@keen.io/ui-core';

import {
  Container,
  Details,
  Title,
  TagsWrapper,
  Excerpt,
  Heading,
  ActionsContainer,
  BadgeContainer,
} from './Header.styles';

type Props = {
  /** Dashboard title */
  title: string;
  /** Excerpt message */
  excerpt: string;
  /** Public dashboard indicator */
  isPublic?: boolean;
  /** Dashboard tags pool */
  tags?: string[];
  /** Children nodes */
  children: React.ReactNode;
};

const Header: FC<Props> = ({ title, excerpt, isPublic, tags, children }) => (
  <Container>
    <Heading>
      <Title>{title}</Title>
      <Details>
        <Excerpt>{excerpt}</Excerpt>
        <TagsWrapper>
          {isPublic && (
            <BadgeContainer>
              <Badge variant="green">Public</Badge>
            </BadgeContainer>
          )}
          {tags?.length > 0 &&
            tags.map((tag) => (
              <BadgeContainer key={tag}>
                <Badge>{tag}</Badge>
              </BadgeContainer>
            ))}
        </TagsWrapper>
      </Details>
    </Heading>
    <ActionsContainer>{children}</ActionsContainer>
  </Container>
);

export default Header;
