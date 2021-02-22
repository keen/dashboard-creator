import styled from 'styled-components';
import { transparentize } from 'polished';
import { colors } from '@keen.io/colors';

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
