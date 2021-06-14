import styled from 'styled-components';
import { DEFAULT_BACKGROUND_COLOR } from './constants';

export const Container = styled.div<{ background?: string }>`
  display: flex;
  justify-content: center;
  width: 100%;
  background: ${(props) => props.background || DEFAULT_BACKGROUND_COLOR};
  position: relative;
`;

export const Content = styled.div`
  width: 100%;
  padding: 20px;
`;

export const DropdownContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
`;
