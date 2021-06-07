import styled from 'styled-components';
import { colors } from '@keen.io/colors';

export const Container = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;

  overflow-wrap: break-word;
  height: inherit;
`;

export const Html = styled.div<{
  textAlignment: string;
}>`
  width: 100%;
  font-size: 20px;
  font-family: 'Lato Regular', sans-serif;
  color: ${colors.black[100]};
  text-align: ${(props) => props.textAlignment};

  p {
    margin: 0;
  }
`;
