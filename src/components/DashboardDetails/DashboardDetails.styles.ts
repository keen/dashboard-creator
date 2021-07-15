import styled from 'styled-components';
import { motion } from 'framer-motion';
import { colors } from '@keen.io/colors';

export const Header = styled.div`
  display: flex;
  align-items: center;
`;

export const Title = styled.div`
  font-family: 'Lato', sans-serif;
  font-weight: bold;
  font-size: 20px;
  color: ${colors.blue[500]};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const BackButton = styled(motion.div)`
  margin: 10px 0 0 10px;
  display: inline-flex;
  cursor: pointer;
`;

export const BackText = styled.div`
  margin-left: 5px;
`;

export const Tag = styled.div`
  margin-left: 10px;
`;

export const Container = styled.div`
  min-width: 0;
`;
