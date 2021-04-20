import React, { FC, useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { Tooltip, UI_LAYERS } from '@keen.io/ui-core';
import { copyToClipboard } from '@keen.io/charts-utils';

import { Input, Button, Group, TooltipText } from './InputGroup.styles';

import { TOOLTIP_MOTION as MOTION } from '../../../../constants';
import { TOOLTIP_HIDE } from '../../constants';

type Props = {
  value: string;
};

const InputGroup: FC<Props> = ({ value }) => {
  const { t } = useTranslation();
  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
  });

  const tooltipHide = useRef(null);
  const containerRef = useRef(null);

  const clickHandler = useCallback(
    (e: React.MouseEvent<Element, MouseEvent>) => {
      if (tooltipHide.current) clearTimeout(tooltipHide.current);
      copyToClipboard(value);

      const {
        top,
        left,
      }: ClientRect = containerRef.current.getBoundingClientRect();

      const tooltipX = e.pageX - left - window.scrollX;
      const tooltipY = e.pageY - top - window.scrollY;

      setTooltip((state) => ({
        ...state,
        visible: true,
        x: tooltipX,
        y: tooltipY,
      }));

      tooltipHide.current = setTimeout(() => {
        setTooltip((state) => ({
          ...state,
          visible: false,
          x: 0,
          y: 0,
        }));
      }, TOOLTIP_HIDE);
    },
    [value]
  );

  return (
    <Group ref={containerRef}>
      <Input value={value} title={value} type="text" readOnly={true} />
      <Button onClick={(e: React.MouseEvent) => clickHandler(e)}>
        {t('dashboard_share.copy')}
      </Button>
      <AnimatePresence>
        {tooltip.visible && (
          <motion.div
            {...MOTION}
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
            <Tooltip mode="dark" hasArrow={false}>
              <TooltipText>{t('dashboard_share.copied')}</TooltipText>
            </Tooltip>
          </motion.div>
        )}
      </AnimatePresence>
    </Group>
  );
};

export default InputGroup;
