import styled from 'styled-components';
import { transparentize } from 'polished';
import { colors } from '@keen.io/colors';

export const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
`;

export const CreateNewQuery = styled.div`
  display: flex;
  padding: 20px;
  border-bottom: solid 1px ${colors.white[300]};
`;

export const NewQueryButton = styled.div`
  flex-shrink: 0;
`;

export const SavedQueries = styled.div`
  padding: 20px;
`;

export const QueriesContainer = styled.div`
  margin-top: 15px;
  max-height: 370px;
  overflow-y: scroll;
`;

export const Message = styled.div`
  margin-top: 15px;
  font-size: 14px;
  font-family: 'Lato Regular', sans-serif;
  color: ${colors.blue[500]};
`;

export const Description = styled.div`
  margin-left: 20px;

  font-family: 'Lato Regular', sans-serif;
  font-size: 14px;
  line-height: 17px;
  color: ${transparentize(0.3, colors.black[100])};
`;
