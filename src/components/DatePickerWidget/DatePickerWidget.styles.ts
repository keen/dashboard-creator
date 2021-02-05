import styled from 'styled-components';
import { colors } from '@keen.io/colors';

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

export const Title = styled.div`
  margin: 2px 0 0 10px;
  font-size: 14px;
  font-family: 'Lato Bold', sans-serif;
  color: ${colors.blue[500]};
`;
