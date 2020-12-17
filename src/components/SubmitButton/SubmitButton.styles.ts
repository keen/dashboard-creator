import styled from 'styled-components';
import { transparentize } from 'polished';
import { colors } from '@keen.io/colors';

export const SuccessButton = styled.button`
  background-color: ${colors.green['500']};
  color: ${colors.white['500']};

  font-family: 'Lato Bold', sans-serif;
  font-size: 14px;
  line-height: 17px;
  letter-spacing: 0;

  border: solid 1px ${colors.green['300']};
  border-radius: 0px;
  height: 47px;
  display: inline-block;
  width: 125px;

  box-shadow: 0 2px 4px 0 ${transparentize(0.85, colors.black['500'])};
  outline: none;
  border: none;
  cursor: pointer;

  transition: all 0.2s linear;

  &:hover {
    box-shadow: none;
    color: ${colors.white['500']};
    background-color: ${colors.green['300']};
  }
`;
