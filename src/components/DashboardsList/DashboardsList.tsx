import React, { FC } from 'react';

import { DashboardsGrid, DashboardItem } from './DashboardsList.styles';
import DashboardTile from '../DashboardTile';

import { DashboardMetaData } from '../../modules/dashboards';

type Props = {
  /** Collection of dashboards */
  dashboards: DashboardMetaData[];
  /** Edit dashboard event handler */
  onEditDashboard: (id: string) => void;
};

const DashboardsList: FC<Props> = ({ dashboards, onEditDashboard }) => {
  return (
    <DashboardsGrid>
      {dashboards.map(({ id, widgets }) => (
        <DashboardItem key={id}>
          <DashboardTile
            id={id}
            onEdit={() => onEditDashboard(id)}
            useDefaultThumbnail={widgets === 0}
          />
        </DashboardItem>
      ))}
    </DashboardsGrid>
  );
};

export default DashboardsList;
