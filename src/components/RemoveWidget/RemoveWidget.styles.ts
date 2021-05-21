import styled from 'styled-components';
import { colors } from '@keen.io/colors';

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  width: 100%;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;

  cursor: default;
`;

export const Message = styled.div`
  margin-bottom: 25px;
  font-family: 'Lato Regular', sans-serif;
  font-size: 16px;
  text-align: center;
  color: ${colors.black[500]};
`;

export const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;

  & > button {
    margin: 0 12.5px 10px 12.5px;
  }
`;
