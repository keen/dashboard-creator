import styled from 'styled-components';

export const Color = styled.div<{ background: string }>`
  width: 37px;
  height: 37px;
  cursor: pointer;
  background: ${(props) => props.background};
  display: inline-block;
  box-shadow: 0 2px 4px 0 rgba(29, 39, 41, 0.15);
`;

export const DropdownWrapper = styled.div`
  width: 220px;
`;

export const ColorWrapper = styled.div`
  display: inline-block;
  width: 37px;
`;
