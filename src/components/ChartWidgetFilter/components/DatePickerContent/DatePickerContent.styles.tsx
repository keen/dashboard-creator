import styled from 'styled-components';
import { colors } from '@keen.io/colors';

export const TimeframeWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Separator = styled.div`
  margin-top: 4px;
  margin-bottom: 4px;
  font-family: 'Lato Bold', sans-serif;
  font-size: 13px;
  line-height: 17px;
  color: ${colors.black[100]};
`;
