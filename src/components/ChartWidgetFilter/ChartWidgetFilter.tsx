import React, { FC, useState, useRef, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { Portal, Tooltip, UI_LAYERS } from '@keen.io/ui-core';
import { Icon, IconType } from '@keen.io/icons';
import { colors } from '@keen.io/colors';
import { Timeframe as TimeframeType } from '@keen.io/query';

import { AppContext } from '../../contexts';
import { TOOLTIP_MOTION } from '../../constants';

import {
  Container,
  IconContainer,
  Title,
  Timeframe,
  Separator,
  TimeframeWrapper,
} from './ChartWidgetFilter.styles';

type Props = {
  icon?: IconType;
  timeframe: string | TimeframeType;
};

const TOOLTIP_OFFSET = 10;

const ChartWidgetFilter: FC<Props> = ({ icon = 'date-picker', timeframe }) => {
  const { t } = useTranslation();
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
    const {
      right,
      width,
    }: ClientRect = tooltipRef.current.getBoundingClientRect();

    if (right > document.body.offsetWidth) {
      setTooltip((state) => ({
        ...state,
        x: document.body.offsetWidth - width - TOOLTIP_OFFSET,
      }));
    }
  }, [tooltip.visible]);

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
              ref={tooltipRef}
            >
              <Tooltip mode="light" hasArrow={false}>
                <Title>{t('dashboard_timepicker.timeframe_modified')}</Title>
                {typeof timeframe === 'string' ? (
                  <Timeframe>{timeframe}</Timeframe>
                ) : (
                  <TimeframeWrapper>
                    <Timeframe>{timeframe.start}</Timeframe>
                    <Separator>{t('dashboard_timepicker.separator')}</Separator>
                    <Timeframe>{timeframe.end}</Timeframe>
                  </TimeframeWrapper>
                )}
              </Tooltip>
            </motion.div>
          )}
        </AnimatePresence>
      </Portal>
    </Container>
  );
};

export default ChartWidgetFilter;
