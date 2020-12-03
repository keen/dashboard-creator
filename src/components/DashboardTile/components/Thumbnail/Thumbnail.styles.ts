import styled from 'styled-components';
import { transparentize } from 'polished';
import { colors } from '@keen.io/colors';

export const Container = styled.div`
  max-width: 100%;
  height: 170px;
  position: relative;
  background: ${colors.white[500]};
`;

export const Message = styled.div`
  margin-top: 10px;
  font-family: 'Lato Regular', sans-serif;
  line-height: 17px;
  font-size: 14px;
  color: ${transparentize(0.8, colors.blue[500])};
`;

export const DefaultThumbnail = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
  flex-direction: column;
  justify-content: center;
`;

export const Gradient = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;

  background: linear-gradient(
    180deg,
    rgba(241, 245, 248, 0.7) 0%,
    rgba(255, 255, 255, 0) 100%
  );
`;
