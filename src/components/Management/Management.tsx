import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuid } from 'uuid';

import DashboardsList from '../DashboardsList';
import DashboardsPlaceholder from '../DashboardsPlaceholder';
import ManagementNavigation from '../ManagementNavigation';

import {
  createDashboard,
  editDashboard,
  getDashboardsList,
  getDashboardsLoadState,
} from '../../modules/dashboards';

type Props = {};

const Management: FC<Props> = () => {
  const dispatch = useDispatch();
  const dashboards = useSelector(getDashboardsList);
  const dashboardsLoaded = useSelector(getDashboardsLoadState);

  const isEmptyProject = dashboardsLoaded && dashboards.length === 0;

  return (
    <div>
      <ManagementNavigation
        onCreateDashboard={() => {
          const dashboardId = uuid();
          dispatch(createDashboard(dashboardId));
        }}
      />
      {isEmptyProject || !dashboardsLoaded ? (
        <DashboardsPlaceholder />
      ) : (
        <DashboardsList
          onPreviewDashboard={(id) => dispatch(editDashboard(id))}
          onShowDashboardSettings={() => {
            console.log('onShowDashboardSettings');
          }}
          dashboards={dashboards}
        />
      )}
    </div>
  );
};

export default Management;
