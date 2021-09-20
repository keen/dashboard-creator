import styled, { css } from 'styled-components';
import { transparentize } from 'polished';
import { colors } from '@keen.io/colors';

const textOverflowMixin = () => css`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  max-width: 100%;
`;

export const Container = styled.div`
  display: flex;
  align-items: center;
  font-family: 'Lato Regular', sans-serif;
  font-size: 14px;
  line-height: 17px;
  color: ${colors.blue[500]};
  min-width: 0;
`;

export const IncludesToday = styled.span`
  ${textOverflowMixin};

  margin-left: 4px;
  color: ${transparentize(0.4, colors.blue[500])};
`;

export const IconContainer = styled.div`
  display: flex;
  margin-right: 10px;
  flex-shrink: 0;
`;

export const Timeframe = styled.span`
  ${textOverflowMixin};
  flex-shrink: 0;
`;
