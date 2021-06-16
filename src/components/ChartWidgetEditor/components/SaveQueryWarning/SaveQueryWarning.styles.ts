import styled from 'styled-components';
import { motion } from 'framer-motion';

export const Container = styled.div`
  display: flex;
  align-items: center;
  margin-left: 15px;
`;

export const EditTooltip = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-left: 5px;
`;

export const TooltipContainer = styled(motion.div)`
  position: absolute;
  bottom: 100%;
  left: 10px;
`;

export const TooltipContent = styled.div`
  width: 250px;
`;
