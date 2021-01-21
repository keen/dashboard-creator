import styled from 'styled-components';
import { UI_LAYERS } from '@keen.io/ui-core';

export const Container = styled.div`
  width: 66px;
`;

export const DropdownContainer = styled.div`
  width: 280px;
  z-index: ${UI_LAYERS.dropdown};
`;

export const ColorTone = styled.div``;

export const ColorsContainer = styled.div`
  display: flex;
  padding: 10px;

  ${ColorTone} + ${ColorTone} {
    margin-left: 4px;
  }
`;

export const Square = styled.div`
  margin-top: 4px;
  width: 20px;
  height: 20px;
`;
