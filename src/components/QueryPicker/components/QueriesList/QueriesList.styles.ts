import styled from 'styled-components';
import { transparentize } from 'polished';
import { colors } from '@keen.io/colors';

export const QueryItem = styled.div`
  display: flex;
  align-items: center;
  height: 37px;
  padding: 0 10px;

  font-family: 'Lato Regular', sans-serif;
  font-size: 14px;
  color: ${colors.blue[500]};

  cursor: pointer;
  transition: background 0.2s linear;

  &:hover {
    background: ${transparentize(0.8, colors.green[100])};
  }
`;
