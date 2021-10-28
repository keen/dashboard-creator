import styled, { css } from 'styled-components';
import { transparentize } from 'polished';
import { colors } from '@keen.io/colors';

export const Container = styled.div<{ isOpen: boolean }>`
  position: relative;
  cursor: pointer;

  ${({ isOpen }) =>
    isOpen &&
    css`
      box-shadow: 0 2px 4px 0 ${transparentize(0.85, colors.black[500])};
    `};
`;

export const Filter = styled.div`
  border-radius: 4px;
  background: ${colors.white[500]};
  padding: 10px 14px;
`;
