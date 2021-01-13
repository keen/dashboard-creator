import styled from 'styled-components';
import { layout, LayoutProps } from 'styled-system';
import { colors } from '@keen.io/colors';

export const Container = styled.div<LayoutProps>`
  background: ${colors.white[500]};
  display: flex;
  align-items: center;
  justify-content: center;

  ${layout}
`;
