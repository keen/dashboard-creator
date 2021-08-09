import styled from 'styled-components';
import { motion } from 'framer-motion';
import { transparentize } from 'polished';
import { UI_LAYERS } from '@keen.io/ui-core';
import { colors } from '@keen.io/colors';
import { DEFAULT_BACKGROUND_COLOR } from '../../../../constants';

export const Container = styled.div`
  background: ${DEFAULT_BACKGROUND_COLOR};
  position: relative;
`;

export const NavBar = styled.div`
  border-bottom: solid 1px ${colors.gray[300]};
`;

export const NotificationBar = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  z-index: ${UI_LAYERS.notification};

  display: flex;
  justify-content: center;
  padding: 10px;
  width: 100%;
  box-sizing: border-box;
  background-color: ${colors.white[500]};
  box-shadow: 0 2px 4px 0 rgba(29, 39, 41, 0.15);
`;

export const VisualizationContainer = styled.div`
  padding: 10px;
  position: relative;
`;

export const SectionContainer = styled.div`
  box-shadow: 0 2px 4px 0 ${transparentize(0.85, colors.black[500])};
`;

export const Cancel = styled.div`
  cursor: pointer;
  margin-left: 15px;
  display: flex;
  align-items: center;
`;

export const Footer = styled.div`
  display: flex;
  padding: 10px 25px;
`;

export const IconContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  position: absolute;
  top: 15px;
  right: 15px;
`;
