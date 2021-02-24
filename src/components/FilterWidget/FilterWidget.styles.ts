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
  font-size: 14px;
  margin-left: 5px;
  font-family: 'Lato Bold', sans-serif;
  color: ${colors.blue[500]};
`;

export const DropdownContainer = styled.div<
  { customTransform: string } & LayoutProps
>`
  z-index: ${UI_LAYERS.dropdown};
  position: absolute;
  max-height: 200px;
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

export const FilterButtonSecondary = styled.div`
  color: ${colors.blue[200]};
  font-size: 14px;
  font-family: 'Lato Bold', sans-serif;
  cursor: pointer;
`;

export const LoaderContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 0;
`;

export const DropdownContent = styled.div`
  height: 200px;
  box-sizing: border-box;
  border-top: 1px solid ${colors.gray[300]};
`;

export const DropdownFooter = styled.div`
  display: flex;
  border-top: 1px solid ${colors.gray[300]};
  padding: 10px 14px;
  justify-content: space-between;
  align-items: center;
`;

export const DropdownHeader = styled.div`
  padding: 10px 14px;
`;

export const EmptySearch = styled.div`
  margin-top: 20px;
  width: 100%;
  text-align: center;
  font-family: 'Lato Regular', sans-serif;
  font-size: 16px;
  color: ${colors.blue[500]};
`;

export const SelectedPropertiesNumber = styled.div`
  background: ${colors.lightBlue[400]};
  color: ${colors.black[400]};
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 17px;
  height: 17px;
  border-radius: 50%;
  font-size: 13px;
  margin-left: 2px;
`;
