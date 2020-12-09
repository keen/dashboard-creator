import styled from 'styled-components';
import { colors } from '@keen.io/colors';

export const Content = styled.div`
  width: 100%;
  max-width: 400px;
  padding: 25px;
  box-sizing: border-box;
`;

export const Title = styled.span`
  color: ${colors.red[500]};
`;

export const FooterContent = styled.div`
  display: flex;
  align-items: center;
`;

export const ConfirmButton = styled.div`
  margin-right: 20px;
`;

export const Cancel = styled.span`
  cursor: pointer;
`;

export const Message = styled.div`
  font-size: 16px;
  line-height: 26px;
  font-family: 'Lato Regular', sans-serif;
  color: ${colors.black[400]};

  strong {
    font-family: 'Lato Bold', sans-serif;
  }
`;
