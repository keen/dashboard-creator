import styled from 'styled-components';
import { space, SpaceProps } from 'styled-system';
import { colors } from '@keen.io/colors';

export const Title = styled.div<SpaceProps>`
  font-family: 'Lato Bold', sans-serif;
  font-size: 14px;
  line-height: 17px;
  color: ${colors.black[100]};

  ${space};
`;
