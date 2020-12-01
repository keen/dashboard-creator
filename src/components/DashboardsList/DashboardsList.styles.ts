import styled from 'styled-components';

export const DashboardsGrid = styled.div`
  display: grid;
  grid-gap: 30px;
  grid-template-columns: repeat(1, 1fr);

  @media (min-width: 600px) {
    grid-template-columns: repeat(2, minmax(285px, 1fr));
  }

  @media (min-width: 1140px) {
    grid-template-columns: repeat(3, minmax(360px, 380px));
  }
`;

export const DashboardItem = styled.div`
  width: 100%;
`;
