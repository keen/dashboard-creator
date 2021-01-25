import styled from 'styled-components';
import { transparentize } from 'polished';
import { motion } from 'framer-motion';
import { colors } from '@keen.io/colors';
import { UI_LAYERS } from '@keen.io/ui-core';

export const RemoveMotion = styled(motion.div)`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: ${UI_LAYERS.tooltip};
`;

export const Cover = styled(motion.div)`
  background-color: ${transparentize(0.8, colors.black[500])};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;

  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: ${UI_LAYERS.tooltip};
`;

export const ButtonsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  justify-items: center;
  grid-row-gap: 30px;

  div:first-child {
    grid-column: 1 / -1;
  }
`;
