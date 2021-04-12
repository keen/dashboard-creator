import styled, { css } from 'styled-components';
import { transparentize } from 'polished';
import { colors } from '@keen.io/colors';

export const Order = styled.div<{ isOpen: boolean }>`
  display: flex;
  padding: 10px 14px;
  height: 37px;
  width: 91px;
  box-sizing: border-box;
  border-radius: 4px;
  background: ${colors.white[500]};
  cursor: pointer;

  ${({ isOpen }) =>
    isOpen &&
    css`
      box-shadow: 0 2px 4px 0 ${transparentize(0.85, colors.black[500])};
    `};
`;

export const DropIndicator = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
  padding-left: 5px;
  cursor: pointer;
`;

export const List = styled.ul`
  padding: 0;
  margin: 0;
  list-style: none;
`;

export const ListItem = styled.li<{
  isActive: boolean;
}>`
  padding: 10px 16px;
  cursor: pointer;

  &:hover {
    background: ${transparentize(0.8, colors.green[100])};
  }

  ${(props) =>
    props.isActive &&
    css`
      background: ${transparentize(0.8, colors.green[100])};
    `}
`;
