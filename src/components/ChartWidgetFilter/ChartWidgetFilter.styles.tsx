import styled from 'styled-components';
import { transparentize } from 'polished';
import { colors } from '@keen.io/colors';
import { UI_LAYERS } from '@keen.io/ui-core';

export const Container = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: ${UI_LAYERS.element};
`;

export const IconContainer = styled.div`
  padding: 10px;
  border-radius: 4px;
  background-color: ${transparentize(0.85, colors.blue[100])};
  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
`;

export const Title = styled.div`
  margin-bottom: 10px;
  font-family: 'Lato Bold', sans-serif;
  font-size: 14px;
  line-height: 17px;
  color: ${colors.black[100]};
`;

export const Timeframe = styled.div`
  font-family: 'Lato Regular', sans-serif;
  font-size: 14px;
  line-height: 17px;
  color: ${colors.blue[500]};
`;

export const TimeframeWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Separator = styled.div`
  margin-top: 4px;
  margin-bottom: 4px;
  font-family: 'Lato Regular', sans-serif;
  font-size: 13px;
  line-height: 17px;
  color: ${colors.blue[100]};
`;