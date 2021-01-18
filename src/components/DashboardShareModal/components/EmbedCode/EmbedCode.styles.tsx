import styled from 'styled-components';
import { transparentize } from 'polished';
import { colors } from '@keen.io/colors';

export const Placeholder = styled.div`
  padding: 50px 0;
  font-family: 'Lato Regular', sans-serif;
  font-size: 16px;
  line-height: 19px;
  color: ${transparentize(0.5, colors.black[100])};

  display: flex;
  justify-content: center;
  align-items: center;
`;

export const CodeWrapper = styled.div`
  max-height: 360px;
  overflow-y: auto;
`;

export const Navigation = styled.div`
  padding: 10px 25px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
`;

export const NavigationItem = styled.div`
  margin-right: 20px;

  &:last-child {
    margin-right: 0;
  }
`;
