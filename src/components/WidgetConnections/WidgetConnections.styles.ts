import styled from 'styled-components';

export const ConnectionItem = styled.div`
  display: flex;
  cursor: pointer;
  align-items: center;
  column-gap: 4px;
`;

export const Connections = styled.div`
  ${ConnectionItem} + ${ConnectionItem} {
    margin-top: 15px;
  }
`;
