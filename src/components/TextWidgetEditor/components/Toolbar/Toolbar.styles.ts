import styled, { css } from 'styled-components';
import { transparentize } from 'polished';
import { colors } from '@keen.io/colors';

export const Container = styled.div`
  display: flex;
`;

export const TextOption = styled.div<{ isActive?: boolean }>`
  padding: 0 14px;
  display: inline-flex;
  align-items: center;
  height: 37px;
  background: ${colors.white[500]};
  border-radius: 4px;
  box-sizing: border-box;

  cursor: pointer;

  ${(props) =>
    props.isActive &&
    css`
      background: ${transparentize(0.85, colors.blue[500])};
    `}
`;
