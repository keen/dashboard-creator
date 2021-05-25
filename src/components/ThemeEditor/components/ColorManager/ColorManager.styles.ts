import styled from 'styled-components';
import { colors } from '@keen.io/colors';

export const Container = styled.div`
  display: flex;
`;

export const Heading = styled.div`
  margin-top: 8px;
`;

export const Settings = styled.div`
  width: 100%;
`;

export const SelectColorPalette = styled.div`
  width: 240px;
`;

export const ColorsList = styled.div`
  width: 380px;
  padding: 10px;
  box-sizing: border-box;
`;

export const ColorItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

export const Palette = styled.div`
  display: flex;
`;

export const ColorRectangle = styled.div`
  width: 30px;
  height: 20px;
`;

export const Divider = styled.div`
  margin: 8px 0;
  height: 1px;
  background: ${colors.white[300]};
`;
