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

export const Aside = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
`;

export const SavingIndicator = styled.div`
  display: flex;
  align-items: center;
`;

export const Message = styled.span`
  margin: 0 20px 0 6px;
  color: ${transparentize(0.5, colors.black[100])};
  font-family: 'Lato Medium', sans-serif;
  font-size: 12px;
`;

export const ChildrenWrapper = styled.div`
  margin: 5px 0 5px 10px;
`;
