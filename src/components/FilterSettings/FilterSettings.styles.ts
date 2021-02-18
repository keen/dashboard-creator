import styled from 'styled-components';
import { space, layout, LayoutProps, SpaceProps } from 'styled-system';
import { colors } from '@keen.io/colors';

export const Container = styled.div`
  width: 500px;
`;

export const FooterContent = styled.div`
  display: flex;
`;

export const CancelButton = styled.div`
  margin-left: 15px;
`;

export const ConnectionsContainer = styled.div`
  margin-top: 20px;
  padding-top: 20px;
  border-top: solid 1px ${colors.white[300]};
`;

export const Content = styled.div`
  padding: 30px 25px;
`;

export const ErrorContainer = styled.div`
  margin-bottom: 15px;
`;

export const FieldGroup = styled.div`
  display: flex;
`;

export const Field = styled.div<LayoutProps & SpaceProps>`
  ${space};
  ${layout};
`;

export const Description = styled.div<SpaceProps>`
  color: ${colors.black[100]};
  font-size: 14px;
  font-family: 'Lato Bold', sans-serif;
  line-height: 17px;
  ${space};
`;
