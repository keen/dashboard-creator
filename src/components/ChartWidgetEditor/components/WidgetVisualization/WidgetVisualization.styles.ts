import styled from 'styled-components';
import { colors } from '@keen.io/colors';

export const Container = styled.div`
  display: flex;
`;

export const Placeholder = styled.div`
  padding: 15px;
  margin: 0 auto;
  display: flex;
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
