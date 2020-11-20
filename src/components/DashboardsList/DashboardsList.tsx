import React, { FC } from 'react';

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
    <div>
      {dashboards.map(({ id }) => (
        <DashboardTile key={id} id={id} onEdit={() => onEditDashboard(id)} />
      ))}
    </div>
  );
};

export default DashboardsList;
