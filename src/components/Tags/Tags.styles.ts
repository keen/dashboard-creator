import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';
import { colors } from '@keen.io/colors';
import { UI_LAYERS } from '@keen.io/ui-core';

import { DROP_INDICATOR } from './constants';

export const TagsWrapper = styled.div<{
  tagsOverflow: boolean;
}>`
  box-sizing: border-box;
  margin-left: 6px;
  height: 20px;
  width: 100%;
  overflow: hidden;

  ${(props) =>
    props.tagsOverflow &&
    css`
      padding: 0 5px;
      margin-right: 25px;
    `}
`;

export const TagsTooltip = styled(motion.div)<{
  x: number;
  y: number;
  width: number;
}>`
  position: absolute;
  top: ${(props) => props.y}px;
  left: ${(props) => props.x}px;
  width: ${(props) => props.width}px;
  background: ${colors.white[500]};
  box-shadow: 0 2px 4px 0 rgba(29, 39, 41, 0.15);
  z-index: ${UI_LAYERS.element};
  overflow: hidden;
  will-change: height, opacity;
`;

export const BadgeContainer = styled.div<{
  maxWidth?: number;
  padding?: boolean;
}>`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 5px;
  line-height: 1;
  margin-left: auto;

  ${(props) =>
    props.padding &&
    css`
      padding: 5px;
    `}

  ${(props) =>
    props.maxWidth &&
    css`
      max-width: ${props.maxWidth -
      DROP_INDICATOR.width -
      2 * DROP_INDICATOR.padding}px;
    `}
`;

export const DropIndicatorContainer = styled.div<{ isOpen: boolean }>`
  position: absolute;
  right: 0;
  top: 0;
`;
