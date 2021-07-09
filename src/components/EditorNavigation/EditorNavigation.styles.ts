import styled from 'styled-components';
import { motion } from 'framer-motion';
import { space, SpaceProps } from 'styled-system';

export const Container = styled.div`
  padding: 0 0 30px 0;
  display: flex;
`;

export const Aside = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
`;

export const TooltipMotion = styled(motion.div)`
  position: absolute;
  right: 0;
  top: 100%;
  transform: translateY(4px);
`;

export const ButtonContainer = styled.div<SpaceProps>`
  position: relative;
  ${space}
`;
