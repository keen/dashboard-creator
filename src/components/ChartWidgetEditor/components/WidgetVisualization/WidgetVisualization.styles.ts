import styled from 'styled-components';
import { motion } from 'framer-motion';
import { transparentize } from 'polished';
import { colors } from '@keen.io/colors';

export const Container = styled.div`
  display: flex;
`;

export const RunQuery = styled.div`
  margin-top: 30px;
`;

export const FadeMask = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;

  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: ${transparentize(0.4, colors.white[500])};
`;

export const DatavizContainer = styled.div`
  position: relative;
  flex-grow: 1;
  margin: 0 auto;
  min-height: 360px;
  max-height: 440px;
  min-width: 0;
  max-width: 80%;
`;

export const Placeholder = styled.div`
  padding: 15px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  font-family: 'Gangster Grotesk Regular', sans-serif;
  font-size: 20px;
  color: ${colors.green[500]};

  box-sizing: border-box;
  height: 350px;
  width: 60%;
  background: ${colors.white[500]};
  box-shadow: 0 2px 4px 0 rgba(29, 39, 41, 0.15);
`;
