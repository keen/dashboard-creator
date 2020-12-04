import React, { FC } from 'react';

import { Placeholder } from './DashboardsPlaceholder.styles';

import { DashboardsGrid } from '../DashboardsList';

type Props = {
  /** Placeholders amount */
  placeholdersAmount?: number;
};

const DashboardsPlaceholder: FC<Props> = ({ placeholdersAmount = 9 }) => (
  <DashboardsGrid data-testid="dashboards-placeholder-grid">
    {new Array(placeholdersAmount).fill(true).map((_, idx) => (
      <Placeholder key={idx} />
    ))}
  </DashboardsGrid>
);

export default DashboardsPlaceholder;
