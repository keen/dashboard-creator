import styled, { css } from 'styled-components';
import { space, SpaceProps } from 'styled-system';
import { motion } from 'framer-motion';
import { transparentize } from 'polished';
import { colors } from '@keen.io/colors';
import { UI_LAYERS } from '@keen.io/ui-core';

export const Label = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;

  font-family: 'Lato Bold', sans-serif;
  font-size: 14px;
  line-height: 17px;
  color: ${colors.black[100]};
`;

export const TooltipWrapper = styled.div<SpaceProps>`
  position: relative;
  display: flex;
  align-items: center;

  cursor: pointer;

  ${space};
`;

export const TooltipContainer = styled(motion.div)`
  position: absolute;
  top: 100%;
  left: 10px;

  z-index: ${UI_LAYERS.tooltip};
`;

export const TooltipContent = styled.div`
  width: 160px;
  font-size: 14px;
  line-height: 17px;
  font-family: 'Lato Regular', sans-serif;
  color: ${colors.black[500]};
`;

export const Message = styled.div`
  margin-bottom: 20px;

  font-family: 'Lato Regular', sans-serif;
  font-size: 14px;
  line-height: 17px;

  color: ${transparentize(0.4, colors.black[100])};
`;

export const TitleWrapper = styled.div`
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
`;

export const Title = styled.div`
  font-family: 'Lato Bold', sans-serif;
  font-size: 14px;
  line-height: 17px;
  color: ${colors.black[100]};
`;

export const Link = styled.a`
  font-family: 'Lato Bold', sans-serif;
  font-size: 12px;
  line-height: 15px;
  color: ${colors.blue[500]};
  text-decoration: none;

  cursor: pointer;
`;

export const Container = styled.div<{ isActive: boolean }>`
  transition: opacity 150ms ease-in-out;

  ${(props) =>
    !props.isActive &&
    css`
      opacity: 0.5;
      pointer-events: none;
    `}
`;
