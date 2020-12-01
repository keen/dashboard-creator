import styled from 'styled-components';
import { motion } from 'framer-motion';
import { colors } from '@keen.io/colors';

export const MotionContainer = styled(motion.div)`
  position: absolute;
  padding: 30px 10px;
  box-sizing: border-box;

  width: 100%;
  max-width: 550px;

  background: ${colors.white[500]};
  color: ${colors.green[500]};
  font-family: 'Gangster Grotesk Regular', sans-serif;
  font-size: 20px;
  line-height: 24px;
  text-align: center;
  box-shadow: 0 10px 24px 0 rgba(29, 39, 41, 0.15);
  cursor: pointer;
`;
