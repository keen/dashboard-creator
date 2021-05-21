import styled, { css } from 'styled-components';
import { colors } from '@keen.io/colors';

export const Content = styled.div`
  display: flex;
  padding: 10px 15px;
  max-height: 700px;
  overflow-y: scroll;
`;

export const Container = styled.div`
  width: 900px;
`;

export const Preview = styled.div`
  margin: 0 15px 0 10px;
`;

export const Cancel = styled.div`
  cursor: pointer;
`;

export const Footer = styled.div<{
  hasBorder: boolean;
}>`
  display: flex;
  align-items: center;
  padding: 15px 25px;
  ${(props) =>
    props.hasBorder &&
    css`
      border-top: solid 1px ${colors.white[300]};
    `};
`;
