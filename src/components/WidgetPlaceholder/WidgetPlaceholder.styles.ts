import styled from 'styled-components';
import { layout, LayoutProps } from 'styled-system';
import { colors } from '@keen.io/colors';

export const Container = styled.div<LayoutProps & { backgroundColor: string }>`
  background: ${(props) => props.backgroundColor};
  display: flex;
  align-items: center;
  justify-content: center;
  ${layout};
`;

Container.defaultProps = {
  backgroundColor: colors.white[500],
};
