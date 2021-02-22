import styled, { css } from 'styled-components';
import { colors } from '@keen.io/colors';

export const Container = styled.div<{ isDisabled: boolean }>`
  position: relative;
  ${(props) =>
    props.isDisabled &&
    css`
      opacity: 0.5;
    `};
`;

export const Property = styled.div`
  overflow: hidden;
`;

export const Message = styled.div`
  padding: 20px 25px;
  font-size: 14px;
  font-family: 'Lato Regular', sans-serif;
  line-height: 17px;
  color: ${colors.blue[500]};
`;
