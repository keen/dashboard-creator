import styled, { css } from 'styled-components';
import { colors } from '@keen.io/colors';

const getFadeOutStyles = () => css`
  pointer-events: none;
  opacity: 0.3;
`;

export const Container = styled.div<{
  isFadeOut?: boolean;
  isHighlighted?: boolean;
}>`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background: ${colors.white[500]};

  ${(props) =>
    props.isHighlighted &&
    css`
      border-radius: 4px;
    `}
  ${(props) => props.isFadeOut && getFadeOutStyles()}
`;

export const TextManagementContainer = styled.div<{ isFadeOut?: boolean }>`
  ${(props) => props.isFadeOut && getFadeOutStyles()}
  height: 100%;
`;

export const FilterContainer = styled.div<{ isFadeOut?: boolean }>`
  position: relative;
  width: 100%;
  height: 100%;
  background: ${colors.white[500]};
  border-radius: 4px;

  ${(props) => props.isFadeOut && getFadeOutStyles()}
`;
