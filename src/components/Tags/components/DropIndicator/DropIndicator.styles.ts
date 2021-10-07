import styled from 'styled-components';
import { transparentize } from 'polished';
import { colors } from '@keen.io/colors';

import { DROP_INDICATOR } from '../../constants';

export const Container = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: ${transparentize(0.85, colors.blue[100])};
  width: ${DROP_INDICATOR.width}px;
  height: ${DROP_INDICATOR.height}px;
  border-radius: 2px;
  cursor: pointer;
`;
