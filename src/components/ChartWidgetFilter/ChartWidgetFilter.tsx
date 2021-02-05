import React, { FC, useState, useRef, useContext } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Portal, Tooltip, UI_LAYERS } from '@keen.io/ui-core';
import { Icon, IconType } from '@keen.io/icons';
import { colors } from '@keen.io/colors';

import { AppContext } from '../../contexts';
import { TOOLTIP_MOTION } from '../../constants';

import { Container, IconContainer, Title } from './ChartWidgetFilter.styles';

type Props = {
  icon?: IconType;
};

const ChartWidgetFilter: FC<Props> = ({ icon = 'date-picker' }) => {
  const { modalContainer } = useContext(AppContext);

  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
  });

  const containerRef = useRef(null);

  const handleMouseEnter = () => {
    const {
      bottom,
      left,
    }: ClientRect = containerRef.current.getBoundingClientRect();

    const tooltipX = left - window.scrollX;
    const tooltipY = bottom - document.body.offsetHeight + window.scrollY;

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
    <Container ref={containerRef}>
      <IconContainer
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Icon
          type={icon}
          fill={colors.black[500]}
          width={15}
          height={15}
          opacity={0.5}
        />
      </IconContainer>
      <Portal modalContainer={modalContainer}>
        <AnimatePresence>
          {tooltip.visible && (
            <motion.div
              {...TOOLTIP_MOTION}
              initial={{ opacity: 0, x: tooltip.x, y: tooltip.y }}
              animate={{
                x: tooltip.x,
                y: tooltip.y,
                opacity: 1,
              }}
              style={{
                position: 'absolute',
                pointerEvents: 'none',
                zIndex: UI_LAYERS.dropdown,
              }}
            >
              <Tooltip mode="light" hasArrow={false}>
                <Title>Timeframe modified</Title>
              </Tooltip>
            </motion.div>
          )}
        </AnimatePresence>
      </Portal>
    </Container>
  );
};

export default ChartWidgetFilter;
