import styled from 'styled-components';
import { motion } from 'framer-motion';
import { transparentize } from 'polished';
import { colors } from '@keen.io/colors';

export const Card = styled.article`
  position: relative;
  border: 1px solid ${colors.gray[300]};
  background-color: ${colors.white[500]};
  box-sizing: border-box;
  box-shadow: 0 2px 4px 0 rgba(29, 39, 41, 0.15);
`;

export const PreviewButton = styled.div`
  background: ${colors.white['500']};
  color: ${colors.blue['500']};
  box-shadow: 0 1px 4px 0 ${transparentize(0.85, colors.black['500'])};

  font-size: 15px;
  font-family: 'Lato Bold', sans-serif;
  text-decoration: none;

  border-radius: 25px;
  height: 45px;
  padding: 0 25px;

  outline: none;
  border: none;
  cursor: pointer;

  display: flex;
  align-items: center;
`;

export const ThumbnailContainer = styled.div`
  position: relative;
  overflow: hidden;
`;

export const ActionsMotion = styled(motion.div)`
  position: relative;
  width: 80px;
  display: flex;
  justify-content: space-between;
`;

export const PreviewMotion = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
  background: ${transparentize(0.8, colors.green['300'])};
  cursor: pointer;
`;
