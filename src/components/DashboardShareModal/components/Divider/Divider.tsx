import styled from 'styled-components';
import { colors } from '@keen.io/colors';

const Divider = styled.hr`
  width: 100%;
  margin: 0;
  box-sizing: border-box;
  border: none;

  height: 1px;
  background-color: ${colors.white[300]};
`;

export default Divider;
