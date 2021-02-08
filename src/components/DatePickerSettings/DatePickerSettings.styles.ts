import styled from 'styled-components';
import { colors } from '@keen.io/colors';

export const Content = styled.div`
  width: 500px;
  padding: 30px 25px;
  box-sizing: border-box;
`;

export const Description = styled.div`
  margin-bottom: 20px;
  font-family: 'Lato Bold', sans-serif;
  font-size: 14px;
  color: ${colors.black[100]};
`;

export const ConnectionsList = styled.div`
  padding: 20px 0;
`;
