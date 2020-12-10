import styled from 'styled-components';
import { colors } from '@keen.io/colors';

export const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
`;

export const QueriesContainer = styled.div`
  margin-top: 15px;
  max-height: 370px;
  overflow-y: scroll;
`;

export const EmptySearch = styled.div`
  margin-top: 15px;
  font-size: 14px;
  font-family: 'Lato Regular', sans-serif;
  color: ${colors.blue[500]};
`;
