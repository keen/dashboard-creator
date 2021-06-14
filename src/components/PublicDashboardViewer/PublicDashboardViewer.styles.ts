import styled from 'styled-components';
import { motion } from 'framer-motion';
import { colors } from '@keen.io/colors';

import { DEFAULT_BACKGROUND_COLOR } from '../../constants';

export const Navigation = styled.div`
  padding: 30px 0;
`;

export const Container = styled.div<{ background?: string }>`
  display: flex;
  justify-content: center;
  width: 100%;
  background: ${(props) => props.background || DEFAULT_BACKGROUND_COLOR};
`;

export const Content = styled.div`
  position: relative;
  width: 100%;
  z-index: 1;
`;

export const Message = styled.div`
  margin-top: 20px;
  color: ${colors.black[500]};
  font-family: 'Lato Regular', sans-serif;
  font-size: 16px;
`;

export const ErrorContainer = styled(motion.div)`
  position: absolute;
  padding: 30px 20px;
  box-sizing: border-box;

  width: 100%;
  max-width: 600px;

  background: ${colors.white[500]};
  text-align: center;
  box-shadow: 0 10px 24px 0 rgba(29, 39, 41, 0.15);
`;

export const DropdownContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
`;
