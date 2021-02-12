import styled from 'styled-components';
import { layout, LayoutProps, system } from 'styled-system';
import { UI_LAYERS } from '@keen.io/ui-core';
import { colors } from '@keen.io/colors';

export const Container = styled.div`
  height: 100%;
  display: flex;
`;

export const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  cursor: pointer;
`;

export const Title = styled.div`
  margin: 2px 0 0 10px;
  font-size: 14px;
  font-family: 'Lato Bold', sans-serif;
  color: ${colors.blue[500]};
`;

export const Bar = styled.div`
  padding: 15px 10px;
  border-top: solid 1px ${colors.white[300]};
  background-color: ${colors.white[500]};
  display: flex;
  align-items: center;

  a {
    margin-left: 10px;
    cursor: pointer;
  }
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

export const SettingsContainer = styled.div`
  padding: 15px 10px;
  border-top: solid 1px ${colors.white[300]};
  border-bottom: solid 1px ${colors.white[300]};
`;

export const Label = styled.div`
  display: flex;
  align-items: center;
  background-color: ${colors.white[500]};
`;

export const Timeframe = styled.div`
  font-family: 'Lato Regular', sans-serif;
  font-size: 14px;
  line-height: 17px;
  color: ${colors.blue[500]};
`;

export const Separator = styled.div`
  font-family: 'Lato Regular', sans-serif;
  font-size: 13px;
  line-height: 17px;
  color: ${colors.blue[100]};
`;
