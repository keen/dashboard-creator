import styled from 'styled-components';
import { colors } from '@keen.io/colors';

export const Container = styled.div`
  display: flex;
  width: 100%;
  background-color: ${colors.white[500]};
  min-width: 0;
  align-items: center;
`;

export const TimeframeWrapper = styled.div`
  padding: 0 14px;
  display: flex;
  align-items: center;
  min-width: 0;
`;

export const Separator = styled.div`
  margin: 0 6px;
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

export const CalendarIconContainer = styled.div`
  margin-right: 10px;
`;
