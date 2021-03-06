import styled from 'styled-components';
import { transparentize } from 'polished';
import { colors } from '@keen.io/colors';
import { UI_LAYERS } from '@keen.io/ui-core';

export const Container = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: ${UI_LAYERS.element};

  display: grid;
  grid-auto-flow: column;
  grid-column-gap: 10px;
`;

export const IconContainer = styled.div`
  padding: 10px;
  border-radius: 4px;
  background-color: ${transparentize(0.85, colors.blue[100])};
  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  transition: background-color 150ms ease-in-out;

  &:hover {
    background-color: ${transparentize(0.6, colors.blue[100])};
  }
`;
