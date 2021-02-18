import React, { FC, useState, useRef, useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import { Portal, Tooltip, UI_LAYERS } from '@keen.io/ui-core';
import { Icon } from '@keen.io/icons';
import { colors } from '@keen.io/colors';

import { DatePickerContent, FiltersContent } from './components';

import { getInterimQuery } from '../../modules/queries';
import { getWidget } from '../../modules/widgets';

import { RootState } from '../../rootReducer';

import { AppContext } from '../../contexts';
import { TOOLTIP_MOTION } from '../../constants';

import { Container, IconContainer } from './ChartWidgetFilter.styles';

type Props = {
  /** Widget id */
  widgetId: string;
};

const TOOLTIP_OFFSET = 10;

const ChartWidgetFilter: FC<Props> = ({ widgetId }) => {
  const { modalContainer } = useContext(AppContext);

  const { widget } = useSelector((rootState: RootState) =>
    getWidget(rootState, widgetId)
  );

  const datePickerData = useSelector((state: RootState) => {
    if (!widget['datePickerId']) return;

    const { data } = getWidget(state, widget['datePickerId']);
    return data;
  });

  const filtersData = useSelector((state: RootState) => {
    if (!widget['filterIds']) return;

    const filters = widget['filterIds'].reduce((acc, item) => {
      const { data } = getWidget(state, item);
      acc.push(data);
    }, []);

    return filters;
  });

  const hasInterimQuery = useSelector((state: RootState) => {
    const interimQuery = getInterimQuery(state, widgetId);
    return !!interimQuery;
  });

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

  if (hasInterimQuery) {
    if (datePickerData) {
      const { timeframe } = datePickerData;
      return (
        <Container ref={containerRef}>
          <IconContainer
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Icon
              type="date-picker"
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
                    <DatePickerContent timeframe={timeframe} />
                  </Tooltip>
                </motion.div>
              )}
            </AnimatePresence>
          </Portal>
        </Container>
      );
    }

    if (filtersData) {
      return (
        <Container ref={containerRef}>
          <IconContainer
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Icon
              type="funnel-widget-vertical"
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
                    <FiltersContent />
                  </Tooltip>
                </motion.div>
              )}
            </AnimatePresence>
          </Portal>
        </Container>
      );
    }
  }

  return (
    <Container ref={containerRef}>
      <IconContainer
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Icon
          type="funnel-widget-vertical"
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
                <FiltersContent />
              </Tooltip>
            </motion.div>
          )}
        </AnimatePresence>
      </Portal>
    </Container>
  );

  return null;

  // if (hasInterimQuery && datePickerData) {
  //   const { timeframe } = datePickerData;
  //   return (
  //     <Container ref={containerRef}>
  //       <IconContainer
  //         onMouseEnter={handleMouseEnter}
  //         onMouseLeave={handleMouseLeave}
  //       >
  //         <Icon
  //           type={icon}
  //           fill={colors.black[500]}
  //           width={15}
  //           height={15}
  //           opacity={0.5}
  //         />
  //       </IconContainer>
  //       <Portal modalContainer={modalContainer}>
  //         <AnimatePresence>
  //           {tooltip.visible && (
  //             <motion.div
  //               {...TOOLTIP_MOTION}
  //               initial={{ opacity: 0, x: tooltip.x, y: tooltip.y }}
  //               animate={{
  //                 x: tooltip.x,
  //                 y: tooltip.y,
  //                 opacity: 1,
  //               }}
  //               style={{
  //                 position: 'absolute',
  //                 pointerEvents: 'none',
  //                 zIndex: UI_LAYERS.dropdown,
  //               }}
  //               ref={tooltipRef}
  //             >
  //               <Tooltip mode="light" hasArrow={false}>
  //                 <DatePickerData timeframe={timeframe} />
  //               </Tooltip>
  //             </motion.div>
  //           )}
  //         </AnimatePresence>
  //       </Portal>
  //     </Container>
  //   );
  // }
};

export default ChartWidgetFilter;
