import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import Tags from '../../../Tags';

import {
  Container,
  Details,
  Title,
  TitlePlaceholder,
  TitleWrapper,
  Excerpt,
  ActionsContainer,
  TagsContainer,
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

const Header: FC<Props> = ({ title, excerpt, isPublic, tags, children }) => {
  const { t } = useTranslation();

  return (
    <Container>
      <TitleWrapper>
        {title ? (
          <Title>{title}</Title>
        ) : (
          <TitlePlaceholder>
            {t('dashboard_tile.untitled_dashboard')}
          </TitlePlaceholder>
        )}
        <ActionsContainer>{children}</ActionsContainer>
      </TitleWrapper>
      <Details>
        <Excerpt>{excerpt}</Excerpt>
        <TagsContainer>
          <Tags tags={tags} extraTag={isPublic && t('dashboard_tile.public')} />
        </TagsContainer>
      </Details>
    </Container>
  );
};

export default Header;
