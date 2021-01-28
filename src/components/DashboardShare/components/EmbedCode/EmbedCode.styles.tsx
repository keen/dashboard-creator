import styled from 'styled-components';
import { motion } from 'framer-motion';
import { layout, space, LayoutProps, SpaceProps } from 'styled-system';
import { transparentize } from 'polished';
import { colors } from '@keen.io/colors';
import { UI_LAYERS } from '@keen.io/ui-core';

export const Placeholder = styled.div`
  padding: 50px 0;
  font-family: 'Lato Regular', sans-serif;
  font-size: 16px;
  line-height: 19px;
  color: ${transparentize(0.5, colors.black[100])};

  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Navigation = styled.div`
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
`;

export const Container = styled.div`
  padding: 20px 25px;
`;

export const Subtitle = styled.div`
  font-family: 'Lato Bold', sans-serif;
  font-size: 14px;
  line-height: 17px;

  color: ${colors.green[500]};
`;

export const StyledText = styled.div<LayoutProps & SpaceProps>`
  font-family: 'Lato Regular', sans-serif;
  font-size: 14px;
  line-height: 18px;
  color: ${colors.black[100]};

  ${layout};
  ${space};

  strong {
    font-family: 'Lato Bold', sans-serif;
  }
`;

export const Step = styled.span`
  font-family: 'Lato Bold', sans-serif;
  font-size: 14px;
  line-height: 18px;

  color: ${colors.green[500]};
`;

export const Code = styled.div`
  background-color: ${colors.gray[100]};
  margin: 10px 0;
  padding: 10px;

  position: relative;
`;

export const ButtonContainer = styled(motion.div)`
  position: absolute;
  top: 10px;
  right: 10px;

  z-index: ${UI_LAYERS.tooltip};
`;

export const TooltipText = styled.div`
  font-family: 'Lato Light', sans-serif;
  font-size: 11px;
  line-height: 14px;
  color: ${colors.white['500']};
`;
