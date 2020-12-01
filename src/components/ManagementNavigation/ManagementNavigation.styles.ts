import styled from 'styled-components';
import { motion } from 'framer-motion';

export const Container = styled.div`
  padding: 30px 0;
`;

export const TopBar = styled.div`
  display: flex;
  align-items: center;
`;

export const Heading = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
  margin-right: 10px;
`;

export const Message = styled.div`
  font-family: 'Lato Regular', sans-serif;
  font-size: 14px;
`;

export const ButtonMotion = styled(motion.div)`
  border-radius: 25px;
`;
