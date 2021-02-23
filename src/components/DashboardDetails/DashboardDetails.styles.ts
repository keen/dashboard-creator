import styled from 'styled-components';
import { motion } from 'framer-motion';
import { colors } from '@keen.io/colors';

export const Header = styled.div`
  display: flex;
  align-items: center;
`;

export const Title = styled.div`
  font-family: 'Lato Bold', sans-serif;
  font-size: 20px;
  color: ${colors.blue[500]};
`;

export const BackButton = styled(motion.div)`
  margin: 10px 0 0 10px;

  display: inline-flex;

  color: ${colors.blue[200]};
  font-family: 'Lato Regular', sans-serif;
  font-size: 14px;
  line-height: 17px;

  cursor: pointer;
`;

export const BackText = styled.div`
  margin-left: 5px;
`;

export const Tag = styled.div`
  margin-left: 10px;
`;
