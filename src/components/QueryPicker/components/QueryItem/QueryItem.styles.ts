import styled, { css } from 'styled-components';
import { transparentize } from 'polished';
import { colors } from '@keen.io/colors';
import { UI_LAYERS } from '@keen.io/ui-core';

export const Container = styled.div`
  display: flex;
  align-items: center;
  height: 37px;
  padding: 0 10px;
  position: relative;

  font-family: 'Lato Regular', sans-serif;
  font-size: 14px;
  color: ${colors.blue[500]};

  cursor: pointer;
  transition: background 0.2s linear;

  &:hover {
    background: ${transparentize(0.8, colors.green[100])};
  }
`;

export const Name = styled.div<{
  isOverflow: boolean;
}>`
  margin-left: 10px;
  white-space: nowrap;

  ${(props) =>
    props.isOverflow &&
    css`
      max-width: 260px;
      overflow: hidden;
      text-overflow: ellipsis;
    `}
`;

export const TagsContainer = styled.div`
  width: calc(100% - 260px);
  margin-left: auto;
  display: flex;
  align-items: center;
  height: 20px;

  position: relative;
  box-sizing: border-box;
`;

export const TooltipContainer = styled.div`
  position: absolute;
  top: -37px;
  z-index: ${UI_LAYERS.tooltip};
`;
