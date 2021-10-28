import styled, { css } from 'styled-components';
import { transparentize } from 'polished';
import { colors } from '@keen.io/colors';

export const Content = styled.div`
  display: flex;
  padding: 10px 15px;
  max-height: 700px;
  overflow-y: scroll;
`;

export const Container = styled.div<{
  overflowTop: boolean;
  overflowBottom: boolean;
}>`
  width: 900px;

  ${({ overflowTop, overflowBottom }) => {
    let boxShadow = ``;
    if (overflowTop)
      boxShadow += `inset 0 10px 6px -6px  ${transparentize(
        0.85,
        colors.black[500]
      )}`;
    if (overflowTop && overflowBottom) boxShadow += ',';
    if (overflowBottom)
      boxShadow += `inset 0 -10px 6px -6px ${transparentize(
        0.85,
        colors.black[500]
      )}`;
    return css`
      box-shadow: ${boxShadow};
    `;
  }};
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
