import styled, { css } from 'styled-components';
import { transparentize } from 'polished';
import { colors } from '@keen.io/colors';

export const Container = styled.div`
  color: ${colors.black[100]};
  font-size: 14px;
  font-family: 'Lato Regular', sans-serif;
`;

export const Order = styled.div`
  display: flex;
  padding: 10px 14px;
  height: 37px;
  width: 91px;
  box-sizing: border-box;
  border-radius: 4px;
  line-height: 17px;
  font-weight: bold;
  background: ${colors.white[500]};
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
  color: ${colors.black[100]};

  &:hover {
    background: ${transparentize(0.8, colors.green[100])};
  }

  ${(props) =>
    props.isActive &&
    css`
      background: ${transparentize(0.8, colors.green[100])};
    `}
`;
