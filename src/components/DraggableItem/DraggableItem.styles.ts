import styled, { css } from 'styled-components';

export const Container = styled.div<{ isDragged: boolean }>`
  cursor: grab;

  ${(props) =>
    props.isDragged &&
    css`
      cursor: grabbing;
    `};
`;
