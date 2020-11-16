import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import DashboardsList from '../DashboardsList';

import { editDashboard, getDashboardsList } from '../../modules/dashboards';

type Props = {};

const DashboardsManagement: FC<Props> = () => {
  const dispatch = useDispatch();
  const dashboards = useSelector(getDashboardsList);

  return (
    <div>
      <DashboardsList
        onEditDashboard={(id) => dispatch(editDashboard(id))}
        dashboards={dashboards}
      />
    </div>
  );
};

export default DashboardsManagement;
