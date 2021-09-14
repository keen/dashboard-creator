import React, { FC, useRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence } from 'framer-motion';
import { Badge } from '@keen.io/ui-core';

import DropIndicator from '../DropIndicator';
import {
  Container,
  Details,
  Title,
  TitlePlaceholder,
  TitleWrapper,
  TagsWrapper,
  Excerpt,
  ActionsContainer,
  BadgeContainer,
  DropIndicatorContainer,
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

const variants = {
  open: { height: 'auto' },
  closed: { height: '20px' },
};

const Header: FC<Props> = ({ title, excerpt, isPublic, tags, children }) => {
  const { t } = useTranslation();

  const [tagsOverflow, setTagsOverflow] = useState(false);
  const [tagsOpen, setTagsOpen] = useState(false);
  const tagsRef = useRef(null);

  useEffect(() => {
    const { offsetHeight, scrollHeight } = tagsRef.current;
    setTagsOverflow(scrollHeight > offsetHeight);
  }, [tagsRef, tags]);

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
        <AnimatePresence>
          <TagsWrapper
            ref={tagsRef}
            isOpen={tagsOpen}
            variants={variants}
            animate={tagsOpen ? 'open' : 'closed'}
            transition={{ ease: 'easeInOut' }}
          >
            {tagsOverflow && (
              <DropIndicatorContainer
                isOpen={tagsOpen}
                onMouseEnter={() => setTagsOpen(true)}
                onMouseLeave={() => setTagsOpen(false)}
              >
                <DropIndicator
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  isActive={tagsOpen}
                />
              </DropIndicatorContainer>
            )}
            <BadgeContainer>
              {isPublic && (
                <Badge variant="green">{t('dashboard_tile.public')}</Badge>
              )}
              {tags?.length > 0 &&
                tags.map((tag) => (
                  <Badge key={tag} variant="purple" truncate>
                    {tag}
                  </Badge>
                ))}
            </BadgeContainer>
          </TagsWrapper>
        </AnimatePresence>
      </Details>
    </Container>
  );
};

export default Header;
