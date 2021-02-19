import styled, { css } from 'styled-components';

export const Container = styled.div<{ isDisabled: boolean }>`
  position: relative;
  ${(props) =>
    props.isDisabled &&
    css`
      opacity: 0.5;
    `};
`;

export const Property = styled.div`
  overflow: hidden;
`;
