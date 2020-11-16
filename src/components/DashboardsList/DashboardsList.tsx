import React, { FC } from 'react';

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
        <div key={id}>
          {id}(<span onClick={() => onEditDashboard(id)}>edit</span>
        </div>
      ))}
    </div>
  );
};

export default DashboardsList;
