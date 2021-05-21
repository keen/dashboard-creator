import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';
import { transparentize } from 'polished';
import { UI_LAYERS } from '@keen.io/ui-core';
import { colors } from '@keen.io/colors';

import { WIDGET_MIN_WIDTH } from './constants';

export const Container = styled.div`
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  border: dashed 1px ${colors.black[100]};
`;

export const DragHandle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
`;

export const EditorContainer = styled.div`
  overflow: hidden;
`;

export const RemoveContainer = styled(motion.div)<{ isOverflow: boolean }>`
  position: absolute;
  left: 0;
  ${({ isOverflow }) =>
    isOverflow &&
    css`
      right: 0;
      left: auto;
    `};
  min-width: ${WIDGET_MIN_WIDTH}px;
  width: 100%;
  box-sizing: border-box;

  box-shadow: 0 2px 4px 0 rgba(29, 39, 41, 0.15);
  z-index: ${UI_LAYERS.dropdown};
`;

export const ManagementContainer = styled(motion.div)<{ isOverflow: boolean }>`
  position: absolute;
  left: 0;
  ${({ isOverflow }) =>
    isOverflow &&
    css`
      right: 0;
      left: auto;
    `};
  background: ${transparentize(0.4, colors.black[300])};

  display: flex;
  align-items: center;

  padding: 0 10px;
  height: 47px;
  min-width: 285px;
  width: 100%;
  box-sizing: border-box;
  z-index: ${UI_LAYERS.dropdown};

  cursor: grab;
`;

export const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  flex: 1;
  column-gap: 10px;
`;

export const ButtonWrapper = styled.div`
  padding: 0 10px;
`;
