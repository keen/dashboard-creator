import styled from 'styled-components';
import { colors } from '@keen.io/colors';

export const Title = styled.div`
  font-size: 16px;
  font-family: 'Lato Regular', sans-serif;
  line-height: 26px;
  color: ${colors.black[400]};
`;

export const Disclaimer = styled.div`
  margin: 5px 0;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

export const Message = styled.div`
  margin: -3px 0 0 5px;
  font-family: 'Lato Regular', sans-serif;
  font-size: 14px;
`;
