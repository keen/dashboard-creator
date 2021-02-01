import React, { FC, useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Tooltip } from '@keen.io/ui-core';

import { Container, TooltipContainer, TooltipContent } from './ListItem.styles';

import { MAX_WIDTH } from './constants';

import { TOOLTIP_MOTION } from '../../../../constants';

type Props = {
  /** Active */
  isActive?: boolean;
  /** Untitled */
  isUntitled?: boolean;
  /** onClick handler */
  onClick: () => void;
  /** onMouseEnter handler */
  onMouseEnter: () => void;
  /** children */
  children?: React.ReactNode;
  /** Parent offsetTop */
  offsetTop?: number;
};

const ListItem: FC<Props> = ({
  isActive,
  isUntitled,
  onClick,
  onMouseEnter,
  children,
  offsetTop,
}) => {
  const [isOverflow, setIsOverflow] = useState(false);
  const [yPos, setYPos] = useState(0);
  const [isVisible, setVisible] = useState(false);
  const container = useRef(null);

  useEffect(() => {
    if (container.current && container.current.scrollWidth > MAX_WIDTH) {
      setIsOverflow(true);
      const { y, height } = container.current.getBoundingClientRect();
      setYPos(y + height / 3 - offsetTop);
    }
  }, [container, offsetTop, isVisible]);

  return (
    <>
      <Container
        ref={container}
        isActive={isActive}
        isUntitled={isUntitled}
        data-testid="dashboard-item"
        onClick={onClick}
        onMouseEnter={() => {
          onMouseEnter();
          setVisible(true);
        }}
        onMouseLeave={() => {
          setVisible(false);
        }}
      >
        {children}
      </Container>
      {
        <AnimatePresence>
          {isOverflow && isVisible && (
            <TooltipContainer {...TOOLTIP_MOTION} top={yPos}>
              <Tooltip mode="dark" hasArrow={false}>
                <TooltipContent>{children}</TooltipContent>
              </Tooltip>
            </TooltipContainer>
          )}
        </AnimatePresence>
      }
    </>
  );
};

export default ListItem;
