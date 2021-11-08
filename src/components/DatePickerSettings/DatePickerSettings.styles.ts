import styled from 'styled-components';
import { motion } from 'framer-motion';
import { colors } from '@keen.io/colors';
import { space, SpaceProps } from 'styled-system';

export const Content = styled.div`
  width: 500px;
  padding: 30px 25px;
  box-sizing: border-box;
`;

export const Description = styled.div<SpaceProps>`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  ${space};
`;

export const TooltipMotion = styled(motion.div)`
  position: absolute;
  left: 20px;
  transform: translateY(-50%);
`;

export const TooltipContent = styled.div`
  width: 160px;
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
  cursor: pointer;
`;

export const Connections = styled.div`
  max-height: 360px;
  overflow-y: scroll;
`;

export const DisplayNameContainer = styled.div`
  border-bottom: solid 1px ${colors.white[300]};
  padding-bottom: 20px;
  margin-bottom: 20px;
`;

export const ToggleAll = styled.div`
  margin-left: auto;
  cursor: pointer;
`;
