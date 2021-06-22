import styled, { css } from 'styled-components';
import { UI_LAYERS } from '@keen.io/ui-core';

export const EditorContainer = styled.div<{ isFixed?: boolean }>`
  margin-bottom: 40px;

  ${({ isFixed }) =>
    isFixed &&
    css`
      position: sticky;
      top: 10px;
      z-index: ${UI_LAYERS.fixedBar};
    `};
`;

export const Content = styled.div`
  position: relative;
  z-index: 1;
`;
