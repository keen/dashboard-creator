import styled from 'styled-components';
import { colors } from '@keen.io/colors';

export const ConnectionItem = styled.div`
  display: flex;
  cursor: pointer;
`;

export const Connections = styled.div`
  ${ConnectionItem} + ${ConnectionItem} {
    margin-top: 15px;
  }
`;

export const Label = styled.div`
  margin: 2px 0 0 4px;
  font-size: 14px;
  font-family: 'Lato Regular', sans-serif;
  color: ${colors.black[100]};
`;
