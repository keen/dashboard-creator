import styled from 'styled-components';
import { motion } from 'framer-motion';
import { transparentize } from 'polished';
import { UI_LAYERS } from '@keen.io/ui-core';
import { colors } from '@keen.io/colors';

export const Container = styled.div`
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  border: dashed 1px ${colors.gray[500]};
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
  left: 0;
  right: 0;
  background: ${transparentize(0.4, colors.black[300])};

  display: flex;
  align-items: center;

  padding: 0 10px;
  height: 47px;
  min-width: 270px;
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
