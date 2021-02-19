import React, { FC, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { SpaceProps } from 'styled-system';
import { colors } from '@keen.io/colors';
import { Icon } from '@keen.io/icons';
import { Tooltip, TooltipMode, UI_LAYERS } from '@keen.io/ui-core';

import { Container, TooltipMotion, TooltipContent } from './TooltipHint.styles';

import { TOOLTIP_MOTION } from '../../../../constants';

type Props = {
  /** Message renderer */
  renderMessage: () => React.ReactNode;
  /** Tooltip color mode */
  tooltipMode?: TooltipMode;
} & SpaceProps;

const TooltipHint: FC<Props> = ({
  renderMessage,
  tooltipMode = 'light',
  ...spaceProps
}) => {
  const [visibile, setVisibility] = useState(false);

  console.log(tooltipMode, 'sa');

  return (
    <Container
      data-testid="tooltip-hint"
      onMouseEnter={() => setVisibility(true)}
      onMouseLeave={() => setVisibility(false)}
      {...spaceProps}
    >
      <Icon type="info" width={16} height={16} fill={colors.black[100]} />
      <AnimatePresence>
        {visibile && (
          <TooltipMotion
            {...TOOLTIP_MOTION}
            role="dialog"
            style={{ zIndex: UI_LAYERS.tooltip }}
          >
            <Tooltip mode={tooltipMode} hasArrow={false}>
              <TooltipContent>{renderMessage()}</TooltipContent>
            </Tooltip>
          </TooltipMotion>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default TooltipHint;
