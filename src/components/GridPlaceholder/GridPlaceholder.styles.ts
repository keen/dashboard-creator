import styled from 'styled-components';
import { grid, GridProps } from 'styled-system';
import { transparentize } from 'polished';
import { colors } from '@keen.io/colors';

export const Grid = styled.div`
  display: grid;
  grid-gap: 30px;
  grid-template-columns: repeat(5, 1fr);
`;

export const Widget = styled.div<GridProps>`
  ${grid}
  min-height: 250px;
  width: 100%;
  background: linear-gradient(
    180deg,
    ${transparentize(0.8, colors.gray[500])} 0%,
    rgba(232, 233, 235, 0) 100%
  ); ;
`;
