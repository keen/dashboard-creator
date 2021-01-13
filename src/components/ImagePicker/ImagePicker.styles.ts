import styled from 'styled-components';
import { colors } from '@keen.io/colors';

export const InsertImage = styled.div`
  padding: 25px;
  border-bottom: solid 1px ${colors.white[300]};
`;

export const Buttons = styled.div`
  flex-shrink: 0;
  display: flex;
  padding: 10px 25px 10px 25px;
`;

export const InputWrapper = styled.div`
  width: 100%;
`;

export const CancelButton = styled.div`
  padding-left: 10px;
`;

export const Description = styled.div`
  margin-bottom: 10px;
  width: 100%;

  font-family: 'Lato Regular', sans-serif;
  font-size: 14px;
  line-height: 17px;
  color: ${colors.black[100]};
`;
