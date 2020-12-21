import styled, { css } from 'styled-components';

export const Container = styled.div<{ disableInteractions: boolean }>`
  width: 100%;
  height: 100%;

  ${(props) =>
    props.disableInteractions &&
    css`
      pointer-events: none;
    `};
`;

export const LoaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
`;
