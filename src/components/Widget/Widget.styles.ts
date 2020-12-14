import styled, { css } from 'styled-components';
import { transparentize } from 'polished';
import { colors } from '@keen.io/colors';
import { UI_LAYERS } from '@keen.io/ui-core';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: ${colors.white[500]};
  position: relative;
`;

export const Cover = styled.div<{ enabled: boolean }>`
  background-color: ${transparentize(0.8, colors.black[500])};
  display: flex;
  align-items: center;
  justify-content: center;

  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: ${UI_LAYERS.tooltip};

  transform: scale(0);
  transform-origin: bottom;
  transition: transform ease-in-out 150ms;

  ${(props) =>
    props.enabled &&
    css`
      transform: scale(1);
    `};
`;

export const ButtonsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  justify-items: center;
  grid-row-gap: 30px;

  button:first-child {
    grid-column: 1 / -1;
  }
`;
