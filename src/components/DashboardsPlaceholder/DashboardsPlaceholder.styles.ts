import styled from 'styled-components';
import { transparentize } from 'polished';
import { colors } from '@keen.io/colors';

export const Placeholder = styled.div`
  height: 250px;
  width: 380px;
  background: linear-gradient(
    180deg,
    ${transparentize(0.8, colors.gray[500])} 0%,
    rgba(232, 233, 235, 0) 100%
  );
`;
