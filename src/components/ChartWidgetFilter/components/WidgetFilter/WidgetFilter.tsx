import React, { FC, useState, useRef, useContext, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Portal, Tooltip, UI_LAYERS } from '@keen.io/ui-core';
import { Icon, IconType } from '@keen.io/icons';
import { colors } from '@keen.io/colors';

import { AppContext } from '../../../../contexts';
import { TOOLTIP_MOTION } from '../../../../constants';

import { IconContainer } from './WidgetFilter.styles';

type Props = {
  /** Icon type */
  icon: IconType;
  /** Widget id */
  children: React.ReactNode;
};

const TOOLTIP_OFFSET = 10;

const WidgetFilter: FC<Props> = ({ icon, children }) => {
  const { modalContainer } = useContext(AppContext);

  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
  });

  const containerRef = useRef(null);
  const tooltipRef = useRef(null);

  useEffect(() => {
    if (!tooltipRef.current) return;
    const { right, width }: ClientRect =
      tooltipRef.current.getBoundingClientRect();

    if (right > document.body.offsetWidth) {
      setTooltip((state) => ({
        ...state,
        x: document.body.offsetWidth - width - TOOLTIP_OFFSET,
      }));
    }
  }, [tooltip.visible]);

  const handleMouseEnter = () => {
    const { bottom, right }: ClientRect =
      containerRef.current.getBoundingClientRect();

    const tooltipX = document.body.offsetWidth - right + window.scrollX;
    const tooltipY = bottom + window.scrollY;

    setTooltip((state) => ({
      ...state,
      visible: true,
      x: tooltipX,
      y: tooltipY,
    }));
  };

  const handleMouseLeave = () => {
    setTooltip((state) => ({
      ...state,
      visible: false,
      x: 0,
      y: 0,
    }));
  };

  return (
    <div ref={containerRef} data-testid="widget-filter">
      <IconContainer
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Icon
          type={icon}
          fill={colors.black[100]}
          width={13}
          height={13}
          opacity={0.5}
        />
      </IconContainer>
      <Portal modalContainer={modalContainer}>
        <AnimatePresence>
          {tooltip.visible && (
            <motion.div
              {...TOOLTIP_MOTION}
              initial={{ opacity: 0, right: tooltip.x, top: tooltip.y }}
              animate={{
                right: tooltip.x,
                top: tooltip.y,
                opacity: 1,
              }}
              style={{
                position: 'absolute',
                pointerEvents: 'none',
                zIndex: UI_LAYERS.dropdown,
              }}
              ref={tooltipRef}
            >
              <Tooltip mode="light" hasArrow={false}>
                {children}
              </Tooltip>
            </motion.div>
          )}
        </AnimatePresence>
      </Portal>
    </div>
  );
};

export default WidgetFilter;
