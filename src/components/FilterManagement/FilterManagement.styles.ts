import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';
import { transparentize } from 'polished';
import { UI_LAYERS } from '@keen.io/ui-core';
import { colors } from '@keen.io/colors';

export const DragHandle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const RemoveContainer = styled(motion.div)<{ isOverflow: boolean }>`
  position: absolute;
  left: 0;
  ${({ isOverflow }) =>
    isOverflow &&
    css`
      left: auto;
      right: 0;
    `};
  width: 420px;
  box-sizing: border-box;

  box-shadow: 0 2px 4px 0 rgba(29, 39, 41, 0.15);
  z-index: ${UI_LAYERS.dropdown};
`;

export const ManagementContainer = styled(motion.div)<{
  isOverflow: boolean;
  isGrabbed: boolean;
}>`
  position: absolute;
  background: ${transparentize(0.4, colors.black[300])};
  left: 0;
  left: 0;
  ${({ isOverflow }) =>
    isOverflow &&
    css`
      left: auto;
      right: 0;
    `};

  display: grid;
  grid-template-columns: auto 1fr;
  grid-column-gap: 10px;
  align-items: center;

  padding: 0 10px;
  height: 47px;
  width: 100%;
  min-width: 200px;
  z-index: ${UI_LAYERS.dropdown};

  cursor: grab;
  box-sizing: border-box;

  ${(props) =>
    props.isGrabbed &&
    css`
      cursor: grabbing;
    `};
`;

export const ButtonsContainer = styled.div`
  display: grid;
  justify-content: center;

  grid-auto-columns: auto;
  grid-auto-flow: column;
  grid-column-gap: 10px;
`;
