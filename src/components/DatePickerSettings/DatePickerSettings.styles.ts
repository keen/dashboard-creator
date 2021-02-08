import styled from 'styled-components';
import { transparentize } from 'polished';
import { motion } from 'framer-motion';
import { colors } from '@keen.io/colors';

export const Content = styled.div`
  width: 500px;
  padding: 30px 25px;
  box-sizing: border-box;
`;

export const Description = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  font-family: 'Lato Bold', sans-serif;
  font-size: 14px;
  color: ${colors.black[100]};
`;

export const TooltipMotion = styled(motion.div)`
  position: absolute;
  left: 20px;
  transform: translateY(-50%);
`;

export const TooltipContent = styled.div`
  width: 160px;
  font-size: 14px;
  font-family: 'Lato Regular', sans-serif;
  color: ${colors.black[100]};
`;

export const FooterContent = styled.div`
  display: flex;
`;

export const CancelButton = styled.div`
  margin-left: 15px;
`;

export const Hint = styled.div`
  position: relative;
  margin-left: 5px;
`;

export const Connections = styled.div`
  max-height: 360px;
  overflow-y: scroll;
`;

export const EmptyConnections = styled.div`
  font-family: 'Lato Regular', sans-serif;
  font-size: 14px;
  color: ${transparentize(0.5, colors.black[100])};
`;
