import styled from 'styled-components';
import { motion } from 'framer-motion';
import { transparentize } from 'polished';
import { UI_LAYERS } from '@keen.io/ui-core';
import { colors } from '@keen.io/colors';

export const DragHandle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: grab;
`;

export const RemoveContainer = styled(motion.div)`
  position: absolute;
  padding: 5px;
  width: 420px;
  box-sizing: border-box;

  background-color: ${transparentize(0.1, colors.white[500])};
  box-shadow: 0 2px 4px 0 rgba(29, 39, 41, 0.15);
  z-index: ${UI_LAYERS.dropdown};
`;

export const ManagementContainer = styled(motion.div)`
  position: absolute;
  background: ${transparentize(0.4, colors.black[300])};

  display: flex;
  grid-column-gap: 10px;
  align-items: center;

  padding: 0 10px;
  height: 47px;
  min-width: 200px;
  z-index: ${UI_LAYERS.dropdown};
`;
