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

export const Image = styled.img`
  width: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto;
`;

export const PlaceholderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
`;
