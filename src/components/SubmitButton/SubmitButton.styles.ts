import styled from 'styled-components';
import { transparentize } from 'polished';
import { colors } from '@keen.io/colors';

export const SuccessButton = styled.button`
  background-color: ${colors.green['500']};
  border: solid 1px ${colors.green['300']};
  color: ${colors.white['500']};
  border-radius: 0px;
  height: 47px;
  display: inline-block;
  width: 125px;
  font-size: 14px;
  line-height: 17px;
  box-shadow: 0 2px 4px 0 ${transparentize(0.85, colors.black['500'])};
  &:hover {
    box-shadow: none;
    color: ${colors.white['500']};
    background-color: ${colors.green['300']};
  }
  letter-spacing: 0;
  font-family: 'Lato Regular', sans-serif;
  outline: none;
  border: none;
  cursor: pointer;
`;
