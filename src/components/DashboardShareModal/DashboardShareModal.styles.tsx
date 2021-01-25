import styled from 'styled-components';
import { space, SpaceProps } from 'styled-system';
import { motion } from 'framer-motion';
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

export const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;

  margin-top: 15px;
`;

export const Text = styled.span`
  cursor: pointer;
`;

export const ModalWrapper = styled.div`
  width: 600px;
  box-sizing: border-box;
`;

export const TabsContainer = styled.div`
  background: linear-gradient(
    0deg,
    ${colors.white[300]} 0%,
    ${colors.white[300]} 1px,
    ${colors.white[500]} 1px,
    ${colors.white[500]} 100%
  );
`;

export const Divider = styled.hr`
  width: 100%;
  margin: 0;
  box-sizing: border-box;
  border: none;

  height: 1px;
  background-color: ${colors.white[300]};
`;
