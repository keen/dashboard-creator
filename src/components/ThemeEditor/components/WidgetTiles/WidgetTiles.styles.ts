import styled from 'styled-components';

export const BorderOption = styled.div`
  padding: 10px;
  cursor: pointer;
`;

export const BorderSettingsWrapper = styled.div`
  display: flex;
`;

export const BorderWidthDropdownWrapper = styled.div`
  margin-left: 10px;
`;

export const DropdownWrapper = styled.div<{ x: number; y: number }>`
  position: absolute;
  top: ${(props) => props.y}px;
  left: ${(props) => props.x}px;
  width: 66px;
`;
