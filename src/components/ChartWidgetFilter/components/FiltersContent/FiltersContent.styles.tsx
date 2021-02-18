import styled from 'styled-components';
import { transparentize } from 'polished';
import { colors } from '@keen.io/colors';

export const Connector = styled.div`
  background-color: ${transparentize(0.3, colors.blue[100])};
  border-radius: 4px;
  padding: 4px;
  margin-top: 5px;
  margin-bottom: 5px;
  font-family: 'Lato Bold', sans-serif;
  color: ${colors.white[500]};
  font-size: 10px;
  line-height: normal;
  text-transform: uppercase;
`;
