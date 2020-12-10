import styled from 'styled-components';
import { transparentize } from 'polished';
import { colors } from '@keen.io/colors';

export const Container = styled.div`
  height: 47px;
  width: 100%;
  display: flex;
  background-color: ${colors.white[500]};
  box-shadow: 0 10px 24px 0 ${transparentize(0.85, colors.black[500])};
`;

export const Right = styled.div`
  margin-left: auto;
`;

export const TimeAgo = styled.div`
  display: inline-block;
  margin-right: 20px;
  margin-top: 16px;
  margin-bottom: 16px;
  color: ${colors.black[100]};
  font-family: 'Lato Medium', sans-serif;
  font-size: 12px;
  opacity: 0.5;
  line-height: 15px;
`;

export const ChildrenWrapper = styled.div`
  margin: 5px 0 5px 10px;
`;
