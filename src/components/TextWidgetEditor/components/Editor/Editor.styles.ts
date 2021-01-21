import styled from 'styled-components';
import { colors } from '@keen.io/colors';

export const Header = styled.div`
  padding: 10px 20px;
  background: ${colors.white[300]};
`;

export const Description = styled.div`
  margin-bottom: 10px;
  font-size: 12px;
  font-family: 'Lato Regular', sans-serif;
  color: ${colors.black[100]};
`;

export const Footer = styled.div`
  display: flex;
  padding: 8px 20px;
  background: ${colors.white[500]};
  border-top: solid 1px ${colors.gray[400]};
`;

export const CancelButton = styled.div`
  margin-left: 10px;
`;

export const EditorContainer = styled.div`
  padding: 10px 12px;
  background: #f1f5f8;

  font-size: 20px;
  font-family: 'Lato Regular', sans-serif;
  color: ${colors.black[100]};
`;
