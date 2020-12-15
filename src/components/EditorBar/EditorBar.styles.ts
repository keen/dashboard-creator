import styled from 'styled-components';
import { transparentize } from 'polished';
import { colors } from '@keen.io/colors';

export const Container = styled.div`
  height: 47px;
  width: 100%;
  display: flex;
  align-items: center;
  background-color: ${colors.white[500]};
  box-shadow: 0 10px 24px 0 ${transparentize(0.85, colors.black[500])};
`;

export const Right = styled.div`
  margin-left: auto;
`;

export const TimeAgo = styled.span`
  margin-right: 20px;
  color: ${transparentize(0.5, colors.black[100])};
  font-family: 'Lato Medium', sans-serif;
  font-size: 12px;
  line-height: 15px;
`;

export const ChildrenWrapper = styled.div`
  margin: 5px 0 5px 10px;
`;
