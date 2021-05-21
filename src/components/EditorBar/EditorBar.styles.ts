import styled, { css } from 'styled-components';
import { transparentize } from 'polished';
import { colors } from '@keen.io/colors';

export const Container = styled.div<{ isSticky: boolean }>`
  height: 47px;
  width: 100%;
  display: flex;
  align-items: center;
  background-color: ${colors.white[500]};
  box-shadow: 0 10px 24px 0 ${transparentize(0.85, colors.black[500])};

  ${({ isSticky }) =>
    isSticky &&
    css`
      position: relative;
      box-shadow: 0 10px 24px 0 ${transparentize(0.7, colors.black[500])};

      &:before {
        content: '';
        display: block;
        position: absolute;
        top: -10px;
        left: 0;
        right: 0;
        height: 10px;
        background-color: #f1f5f8;
      }
    `};
`;

export const EditTheme = styled.div`
  border-radius: 4px;
  height: 37px;
  padding: 0 15px;
  margin-right: 10px;
  display: flex;
  align-items: center;
  background: ${transparentize(0.85, colors.blue[100])};
  cursor: pointer;

  transition: background 0.2s linear;

  &:hover {
    background: ${transparentize(0.85, colors.blue[200])};
  }
`;

export const Aside = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
`;

export const SavingIndicator = styled.div`
  display: flex;
  align-items: center;
`;

export const Message = styled.span`
  margin: 0 8px;
  color: ${transparentize(0.5, colors.black[100])};
  font-family: 'Lato Medium', sans-serif;
  font-size: 12px;
`;

export const ChildrenWrapper = styled.div`
  margin: 5px 0 5px 10px;
`;
