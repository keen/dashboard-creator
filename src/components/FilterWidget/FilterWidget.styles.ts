import styled, { css } from 'styled-components';
import { transparentize } from 'polished';
import { layout, LayoutProps, system } from 'styled-system';
import { UI_LAYERS } from '@keen.io/ui-core';
import { colors } from '@keen.io/colors';

export const Container = styled.div<{ isOpen?: boolean }>`
  height: 100%;
  display: flex;

  ${(props) =>
    props.isOpen &&
    css`
      box-shadow: ${transparentize(0.85, colors.black[500])} 0 0 3px 1px;
    `}
`;

export const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  cursor: pointer;
`;

export const Title = styled.div`
  //margin: 2px 0 0 10px;
  font-size: 14px;
  font-family: 'Lato Bold', sans-serif;
  color: ${colors.blue[500]};
`;

export const DropdownContainer = styled.div<
  { customTransform: string } & LayoutProps
>`
  z-index: ${UI_LAYERS.dropdown};
  position: absolute;

  ${layout}

  ${system({
    customTransform: {
      property: 'transform',
    },
  })}
`;

export const Label = styled.div`
  display: flex;
  align-items: center;
  background-color: ${colors.white[500]};
`;

export const ClearFilter = styled.div`
  padding: 10px 14px;
  border-top: solid 1px ${colors.gray[300]};
  color: ${colors.blue[200]};
  font-size: 14px;
  font-family: 'Lato Bold', sans-serif;
  cursor: pointer;
`;
