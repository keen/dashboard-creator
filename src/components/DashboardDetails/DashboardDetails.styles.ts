import styled from 'styled-components';
import { transparentize } from 'polished';
import { motion } from 'framer-motion';
import { colors } from '@keen.io/colors';

export const Title = styled.div<{
  isActive: boolean;
}>`
  font-family: 'Lato Bold', sans-serif;
  font-size: 20px;
  color: ${(props) =>
    props.isActive ? colors.blue[500] : transparentize(0.5, colors.black[300])};
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
`;
export const BackButton = styled(motion.div)`
  margin-top: 10px;

  display: inline-flex;

  color: ${colors.blue[200]};
  font-family: 'Lato Regular', sans-serif;
  font-size: 14px;
  line-height: 17px;

  cursor: pointer;
`;

export const BackText = styled.div`
  margin-left: 5px;
`;

export const Tag = styled.div`
  margin-left: 10px;
`;
