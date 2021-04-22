import styled from 'styled-components';

export const DashboardsGrid = styled.div`
  display: grid;
  grid-gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(300px, 380px));
`;

export const DashboardItem = styled.div`
  width: 100%;
`;
