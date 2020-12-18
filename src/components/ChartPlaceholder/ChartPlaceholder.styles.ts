import styled, { css } from 'styled-components';
import { layout, LayoutProps } from 'styled-system';
import { colors } from '@keen.io/colors';

type Props = {
  isGhostImage: boolean;
};

export const Container = styled.div<LayoutProps & Props>`
  background: ${colors.white[500]};
  display: flex;
  align-items: center;
  justify-content: center;

  ${layout}

  ${(props) =>
    props.isGhostImage &&
    css`
      transform: translateX(-100%);
    `};
`;
