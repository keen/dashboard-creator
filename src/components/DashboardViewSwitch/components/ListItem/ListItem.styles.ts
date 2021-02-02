import styled, { css } from 'styled-components';
import { transparentize } from 'polished';
import { motion } from 'framer-motion';
import { colors } from '@keen.io/colors';
import { UI_LAYERS } from '@keen.io/ui-core';

export const Container = styled.li<{
  isActive: boolean;
  isUntitled?: boolean;
}>`
  padding: 10px 20px;
  cursor: pointer;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;

  color: ${(props) =>
    props.isUntitled
      ? colors.blue[500]
      : transparentize(0.5, colors.black[300])};

  ${(props) =>
    props.isActive &&
    css`
      background: ${transparentize(0.8, colors.green[100])};
    `}

  &:hover {
    background: ${transparentize(0.8, colors.green[100])};
  }
`;

export const TooltipContainer = styled(motion.div)<{
  top: number;
}>`
  position: absolute;
  top: ${(props) => props.top}px;
  left: 120px;
  z-index: ${UI_LAYERS.tooltip};
`;

export const TooltipContent = styled.div`
  width: 100%;
  font-size: 14px;
  line-height: 17px;
  font-family: 'Lato Regular', sans-serif;
  white-space: nowrap;
  color: ${colors.white[500]};
`;
