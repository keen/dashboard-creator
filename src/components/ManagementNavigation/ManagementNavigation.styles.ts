import styled from 'styled-components';
import {
  FlexDirectionProps,
  SpaceProps,
  space,
  flexDirection,
} from 'styled-system';
import { transparentize } from 'polished';
import { motion } from 'framer-motion';
import { colors } from '@keen.io/colors';

export const Container = styled.div`
  padding: 30px 0;
`;

export const TopBar = styled.div<FlexDirectionProps>`
  display: flex;
  align-items: center;
  ${flexDirection};
`;

export const Heading = styled.div<SpaceProps>`
  display: flex;
  align-items: center;
  flex-grow: 1;
  ${space}
`;

export const Message = styled.div`
  padding: 0 20px;
  font-family: 'Lato Regular', sans-serif;
  font-size: 14px;
  color: ${transparentize(0.4, colors.black[100])};
`;

export const ButtonMotion = styled(motion.div)`
  border-radius: 25px;
`;
