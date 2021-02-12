import styled from 'styled-components';
import { colors } from '@keen.io/colors';

export const Container = styled.div`
  display: flex;
  width: 100%;
  background-color: ${colors.white[500]};
`;

export const Timeframe = styled.div`
  font-family: 'Lato Regular', sans-serif;
  font-size: 14px;
  line-height: 17px;
  color: ${colors.blue[500]};
  align-self: center;
`;

export const TimeframeWrapper = styled.div`
  padding: 0 14px;
  display: flex;
  align-items: center;

  svg + ${Timeframe} {
    margin-left: 10px;
  }
`;

export const Separator = styled.div`
  margin: 0 6px;
  font-family: 'Lato Regular', sans-serif;
  font-size: 13px;
  line-height: 17px;
  color: ${colors.blue[100]};
  align-self: center;
`;

export const IconContainer = styled.div`
  padding-left: 14px;
  padding-right: 14px;
  margin-left: auto;
  display: flex;
  align-items: center;
  border-left: 1px solid #f0f5f8;
  cursor: pointer;
`;
