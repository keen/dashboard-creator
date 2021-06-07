import styled, { css } from 'styled-components';
import { colors } from '@keen.io/colors';

const getFadeOutStyles = () => css`
  pointer-events: none;
  opacity: 0.3;
`;

export const StyledCard = styled.div<{
  isFadeOut?: boolean;
  isHighlighted?: boolean;
  background?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  padding?: number;
  hasShadow?: boolean;
}>`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background: ${(props) => props.background};
  border: ${(props) => `${props.borderWidth}px solid ${props.borderColor}`};
  border-radius: ${(props) => props.borderRadius}px;
  box-sizing: border-box;
  box-shadow: ${(props) =>
    props.hasShadow ? '0px 2px 4px 0px rgba(29,39,41,0.15)' : 'none'};
  padding: ${(props) => props.padding}px;
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

  & + .react-resizable-handle path {
    fill: ${colors.gray[500]};
  }
`;

export const FilterContainer = styled.div<{ isFadeOut?: boolean }>`
  position: relative;
  width: 100%;
  height: 100%;
  background: ${colors.white[500]};
  border-radius: 4px;

  ${(props) => props.isFadeOut && getFadeOutStyles()}
`;
