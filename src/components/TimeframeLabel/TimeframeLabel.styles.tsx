import styled from 'styled-components';
import { colors } from '@keen.io/colors';

export const Container = styled.div`
  background-color: ${colors.white[500]};
  display: flex;
`;

export const Filter = styled.div`
  padding: 10px 14px;
  background-color: ${colors.white[500]};
  display: flex;
  align-items: center;
`;

export const Date = styled.div`
  font-family: 'Lato Regular', sans-serif;
  font-size: 14px;
  line-height: 17px;
  color: ${colors.blue[500]};
`;

export const Separator = styled.div`
  margin-left: 4px;
  margin-right: 4px;
  font-family: 'Lato Regular', sans-serif;
  font-size: 13px;
  line-height: 17px;
  color: ${colors.blue[100]};
`;

export const IconContainer = styled.div`
  padding-left: 14px;
  padding-right: 14px;
  border-left: 1px solid #f0f5f8;
  display: flex;
  justify-content: center;
  align-items: center;

  cursor: pointer;
  transition: 250ms background-color ease-in-out;

  &:hover {
    background-color: ${colors.gray[100]};
  }
`;
