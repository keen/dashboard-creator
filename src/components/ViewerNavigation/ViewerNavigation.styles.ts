import styled from 'styled-components';
import { motion } from 'framer-motion';

export const Container = styled.div`
  display: flex;
`;

export const ButtonWrapper = styled.div`
  position: relative;
  margin-right: 10px;
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

export const ClearFilters = styled.span`
  padding: 0 10px;
  cursor: pointer;
`;
