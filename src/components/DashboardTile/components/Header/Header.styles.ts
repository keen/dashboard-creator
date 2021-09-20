import styled, { css } from 'styled-components';
import { transparentize } from 'polished';
import { motion } from 'framer-motion';
import { colors } from '@keen.io/colors';
import { UI_LAYERS } from '@keen.io/ui-core';

const excerptWidth = '10ch';

export const Container = styled.div`
  padding: 10px 20px;
  height: 90px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
`;

export const Details = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-top: 5px;
  height: 20px;

  position: relative;
  box-sizing: border-box;
`;

export const BadgeContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 5px;
  line-height: 1;
  margin-left: auto;
`;

export const TagsWrapper = styled(motion.div)<{ isOpen: boolean }>`
  box-sizing: border-box;
  will-change: height;

  margin-left: 6px;
  padding: 0 5px 0 5px;
  height: 20px;
  width: calc(100% - ${excerptWidth});
  overflow: hidden;
  position: absolute;
  top: 0;
  right: 0;

  ${(props) =>
    props.isOpen &&
    css`
      top: -5px;
      height: auto;
      padding: 5px 5px 5px 5px;
      background: ${colors.white[500]};
      box-shadow: 0 2px 4px 0 rgba(29, 39, 41, 0.15);
      z-index: ${UI_LAYERS.element};
    `}
`;

export const Title = styled.div`
  font-family: 'Gangster Grotesk Regular', sans-serif;
  font-size: 16px;
  line-height: 19px;
  color: ${colors.black[400]};

  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

export const TitlePlaceholder = styled(Title)`
  color: ${transparentize(0.5, colors.black[400])};
`;

export const Excerpt = styled.div`
  font-family: 'Lato Regular', sans-serif;
  font-size: 12px;
  line-height: 15px;
  color: ${transparentize(0.3, colors.black[100])};
  width: ${excerptWidth};
  text-overflow: ellipsis;
  overflow: hidden;
`;

export const ActionsContainer = styled.div`
  min-width: 0;
  margin-left: auto;
  flex-shrink: 0;
  display: flex;
`;

export const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`;
