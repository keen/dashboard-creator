import styled from 'styled-components';
import { colors } from '@keen.io/colors';

export const Container = styled.div`
  box-sizing: border-box;
  height: 37px;
  border: 1px dashed #cdcfd3;
  border-radius: 4px;
  display: flex;
  align-items: center;
`;

export const IconWrapper = styled.div`
  display: inline-block;
  padding-left: 14px;
`;

export const TextWrapper = styled.div`
  display: inline-block;
  padding-right: 14px;
  padding-left: 5px;
  color: ${colors.black[100]};
  font-family: 'Lato Semibold', sans-serif;
  font-size: 14px;
  line-height: 17px;
`;
