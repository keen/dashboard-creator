import React, { FC, useRef, useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Badge, DynamicPortal } from '@keen.io/ui-core';
import { useDynamicContentPosition } from '@keen.io/react-hooks';

import DropIndicator from './components/DropIndicator';

import {
  TagsWrapper,
  TagsTooltip,
  BadgeContainer,
  DropIndicatorContainer,
} from './Tags.styles';

type Props = {
  /** Tags */
  tags: string[];
  /** isPublic tag */
  extraTag?: string;
};

const variants = {
  open: { height: 'auto', opacity: 1 },
  closed: { height: '0px', opacity: 0 },
};

const Tags: FC<Props> = ({ tags, extraTag = '' }) => {
  const tagsRef = useRef(null);
  const [tagsOpen, setTagsOpen] = useState(false);
  const [tagsOverflow, setTagsOverflow] = useState(false);
  const [tagsWidth, setTagsWidth] = useState(0);
  const { setPosition, contentPosition } = useDynamicContentPosition(tagsRef);

  useEffect(() => {
    const { offsetHeight, scrollHeight, offsetWidth } = tagsRef.current;
    setTagsOverflow(scrollHeight > offsetHeight);
    setTagsWidth(offsetWidth);
  }, [tagsRef, tags]);

  return (
    <>
      <TagsWrapper ref={tagsRef} tagsOverflow={tagsOverflow}>
        <BadgeContainer>
          {!!extraTag && <Badge variant="green">{extraTag}</Badge>}
          {tags?.length > 0 &&
            tags.map((tag) => (
              <Badge key={tag} variant="purple">
                {tag}
              </Badge>
            ))}
        </BadgeContainer>
      </TagsWrapper>
      {tagsOpen && (
        <DynamicPortal>
          <AnimatePresence>
            <TagsTooltip
              variants={variants}
              initial="closed"
              animate={tagsOpen ? 'open' : 'closed'}
              x={contentPosition.x}
              y={contentPosition.y}
              width={tagsWidth}
            >
              <BadgeContainer maxWidth={tagsWidth} padding={true}>
                {!!extraTag && <Badge variant="green">{extraTag}</Badge>}
                {tags?.length > 0 &&
                  tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="purple"
                      truncate
                      truncateMethod="css"
                    >
                      {tag}
                    </Badge>
                  ))}
              </BadgeContainer>
            </TagsTooltip>
          </AnimatePresence>
        </DynamicPortal>
      )}
      {tagsOverflow && (
        <DropIndicatorContainer
          isOpen={tagsOpen}
          onMouseEnter={() => {
            setPosition();
            setTagsOpen(true);
          }}
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
    </>
  );
};

export default Tags;
