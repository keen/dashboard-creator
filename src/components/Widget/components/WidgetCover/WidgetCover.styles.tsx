import styled, { css } from 'styled-components';
import { transparentize } from 'polished';
import { colors } from '@keen.io/colors';

export const Cover = styled.div<{ isHighlighted?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  ${(props) =>
    props.isHighlighted &&
    css`
      border: 1px solid ${colors.green[100]};
      border-radius: 4px;
      background-color: ${transparentize(0.5, '#F0F6F1')};
      pointer-events: none;
    `}
`;

export const Title = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Lato Regular', sans-serif;
  font-size: 20px;
  line-height: 24px;
  color: ${colors.black[100]};

  background-color: ${transparentize(0.1, colors.white[500])};
  box-shadow: 0 2px 4px 0 rgba(29, 39, 41, 0.15);
  padding: 16px;
  flex: 1;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
