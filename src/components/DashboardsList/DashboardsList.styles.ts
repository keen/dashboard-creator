import styled from 'styled-components';

export const DashboardsGrid = styled.div`
  display: grid;
  grid-gap: 20px;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
`;

export const DashboardItem = styled.div`
  width: 100%;
  max-width: 380px;
`;
