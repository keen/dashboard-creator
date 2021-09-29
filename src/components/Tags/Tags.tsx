import React, { FC, useRef, useEffect, useState, useContext } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Badge, DynamicPortal } from '@keen.io/ui-core';
import {
  useDynamicContentPosition,
  useOnParentScroll,
} from '@keen.io/react-hooks';

import DropIndicator from './components/DropIndicator';

import { DROP_INDICATOR } from './constants';

import {
  TagsWrapper,
  TagsTooltip,
  BadgeContainer,
  DropIndicatorContainer,
} from './Tags.styles';

import { Tag } from '../../types';

import { QueryPickerContext } from '../QueryPicker/QueryPicker';

type Props = {
  /** Tags */
  tags?: Tag[];
};

const variants = {
  open: { height: 'auto', opacity: 1 },
  closed: { height: '0px', opacity: 0 },
};

const Tags: FC<Props> = ({ tags }) => {
  const tagsRef = useRef(null);
  const [tagsOpen, setTagsOpen] = useState(false);
  const [tagsOverflow, setTagsOverflow] = useState(false);
  const [tagsWidth, setTagsWidth] = useState(0);

  const { modalContentRef } = useContext(QueryPickerContext);
  const { setPosition, contentPosition } = useDynamicContentPosition(tagsRef);

  useEffect(() => {
    const { offsetHeight, scrollHeight, offsetWidth } = tagsRef.current;
    setTagsOverflow(scrollHeight > offsetHeight);
    setTagsWidth(offsetWidth + 10);
    console.log(offsetWidth, tags[1]?.label);
  }, [tagsRef, tags]);

  useOnParentScroll(modalContentRef, () => setTagsOpen(false));

  return (
    <>
      <TagsWrapper ref={tagsRef} tagsOverflow={tagsOverflow}>
        <BadgeContainer>
          {tags?.length > 0 &&
            tags.map(({ label, variant }: Tag) => (
              <Badge key={label} variant={variant}>
                {label}
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
              x={contentPosition.x - DROP_INDICATOR.padding}
              y={
                contentPosition.y -
                DROP_INDICATOR.height -
                DROP_INDICATOR.padding
              }
              width={tagsWidth}
            >
              <BadgeContainer maxWidth={tagsWidth} padding={true}>
                {tags?.length > 0 &&
                  tags.map(({ label, variant }: Tag) => (
                    <Badge
                      key={label}
                      variant={variant}
                      truncate
                      truncateMethod="css"
                    >
                      {label}
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
