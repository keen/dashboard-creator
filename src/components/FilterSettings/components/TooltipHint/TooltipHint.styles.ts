import styled from 'styled-components';
import { motion } from 'framer-motion';
import { space, SpaceProps } from 'styled-system';

export const Container = styled.div<SpaceProps>`
  display: inline-block;
  position: relative;
  cursor: pointer;
  ${space};
`;

export const TooltipMotion = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 25px;
  transform: translateY(-50%);
`;

export const TooltipContent = styled.div`
  width: 200px;

  font-family: 'Lato Regular', sans-serif;
  font-size: 14px;
  line-height: 17px;
`;
