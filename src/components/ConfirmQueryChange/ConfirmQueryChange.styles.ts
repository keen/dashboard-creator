import styled, { css } from 'styled-components';
import { transparentize } from 'polished';
import { colors } from '@keen.io/colors';
import { BodyText } from '@keen.io/typography';

export const Container = styled.div`
  width: 520px;
`;

export const Back = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-left: 20px;
`;

export const Content = styled.div<{ isOverflow?: boolean }>`
  padding: 20px 25px;
  max-height: 250px;
  overflow: auto;
  ${({ isOverflow }) =>
    isOverflow &&
    css`
      box-shadow: inset 0 -2px 4px 0 ${transparentize(0.85, colors.black[500])};
    `};
`;

export const Footer = styled.div`
  display: flex;

  button + button {
    margin-left: 10px;
  }
`;

export const NoDashboardConnection = styled.div`
  margin-top: 20px;
`;

export const List = styled.ul`
  margin: 10px 0 0 0;
  padding: 0;
  list-style-position: inside;
`;

export const ListItem = styled.li`
  margin-bottom: 5px;
  ${BodyText} {
    display: inline-block;
  }
  &:last-child {
    margin-bottom: 0;
  }
`;

export const Loader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

export const Error = styled.div`
  padding: 10px 0;
`;
