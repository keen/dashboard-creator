import styled, { css } from 'styled-components';

export const Container = styled.div<{ isDisabled: boolean }>`
  ${(props) =>
    props.isDisabled &&
    css`
      opacity: 0.5;
    `};
`;
