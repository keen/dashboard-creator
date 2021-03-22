import styled from 'styled-components';
import { motion } from 'framer-motion';
import { UI_LAYERS } from '@keen.io/ui-core';
import { colors } from '@keen.io/colors';

export const Container = styled.div`
  background: #f1f5f8;
  position: relative;
`;

export const NavBar = styled.div`
  border-bottom: solid 1px ${colors.gray[500]};
`;

export const ChartSettings = styled.div`
  padding: 15px;
  border-bottom: solid 1px ${colors.gray[500]};
  background-color: ${colors.white[500]};
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
`;

export const QuerySettings = styled.div`
  padding: 15px 15px 0 15px;
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
