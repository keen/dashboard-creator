import styled from 'styled-components';
import { transparentize } from 'polished';
import { colors } from '@keen.io/colors';

export const Container = styled.div`
  width: 400px;
`;

export const Back = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-left: 15px;
`;

export const Hint = styled.div`
  padding: 10px 25px;
  font-size: 12px;
  font-family: 'Lato Regular', sans-serif;
  line-height: 18px;
  color: ${colors.black[100]};
  background: ${transparentize(0.8, colors.green[100])};
`;

export const Content = styled.div`
  padding: 20px 25px;
`;

export const Footer = styled.div`
  display: flex;
`;

export const RadioItem = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-top: 15px;
`;

export const RadioLabel = styled.div`
  margin-left: 5px;
  font-size: 16px;
  font-family: 'Lato Regular', sans-serif;
  colors: ${colors.black[300]};
`;

export const Message = styled.div`
  font-size: 16px;
  font-family: 'Lato Regular', sans-serif;
  colors: ${colors.black[300]};
`;
