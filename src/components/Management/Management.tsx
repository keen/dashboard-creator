import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuid } from 'uuid';

import DashboardsList from '../DashboardsList';
import ManagementNavigation from '../ManagementNavigation';

import {
  createDashboard,
  editDashboard,
  getDashboardsList,
} from '../../modules/dashboards';

type Props = {};

const Management: FC<Props> = () => {
  const dispatch = useDispatch();
  const dashboards = useSelector(getDashboardsList);

  return (
    <div>
      <ManagementNavigation
        onCreateDashboard={() => {
          const dashboardId = uuid();
          dispatch(createDashboard(dashboardId));
        }}
      />
      <DashboardsList
        onEditDashboard={(id) => dispatch(editDashboard(id))}
        dashboards={dashboards}
      />
    </div>
  );
};

export default Management;
