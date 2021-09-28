import React, { FC, useRef, useEffect, useState, useContext } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Badge, DynamicPortal } from '@keen.io/ui-core';
import {
  useDynamicContentPosition,
  useOnParentScroll,
} from '@keen.io/react-hooks';

import DropIndicator from './components/DropIndicator';

import { TAGS_TOOLTIP_MIN_WIDTH, DROP_INDICATOR } from './constants';

import {
  TagsWrapper,
  TagsTooltip,
  BadgeContainer,
  DropIndicatorContainer,
} from './Tags.styles';

import { QueryPickerContext } from '../QueryPicker/QueryPicker';

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
  const [tagsWidth, setTagsWidth] = useState(TAGS_TOOLTIP_MIN_WIDTH);

  const { modalContentRef } = useContext(QueryPickerContext);
  const { setPosition, contentPosition } = useDynamicContentPosition(tagsRef);

  useEffect(() => {
    const { offsetHeight, scrollHeight, offsetWidth } = tagsRef.current;
    setTagsOverflow(scrollHeight > offsetHeight);
    offsetWidth > TAGS_TOOLTIP_MIN_WIDTH && setTagsWidth(offsetWidth);
  }, [tagsRef, tags]);

  useOnParentScroll(modalContentRef, () => setTagsOpen(false));

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
              transition={{ ease: 'linear' }}
              animate={tagsOpen ? 'open' : 'closed'}
              x={
                contentPosition.x -
                DROP_INDICATOR.width -
                DROP_INDICATOR.padding
              }
              y={
                contentPosition.y -
                DROP_INDICATOR.height -
                DROP_INDICATOR.padding
              }
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
