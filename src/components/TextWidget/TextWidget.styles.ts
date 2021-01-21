import styled, { css } from 'styled-components';
import { colors } from '@keen.io/colors';

export const TextWidgetContainer = styled.div<{ isEditMode: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  ${(props) =>
    props.isEditMode &&
    css`
      border: dashed 1px ${colors.black[100]};
    `}
`;

export const Container = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

export const Html = styled.div`
  font-size: 20px;
  font-family: 'Lato Regular', sans-serif;
  color: ${colors.black[100]};

  p {
    margin: 0;
  }
`;
