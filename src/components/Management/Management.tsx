import React, { FC, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuid } from 'uuid';

import { Content } from './Management.styles';

import CreateFirstDashboard from '../CreateFirstDashboard';
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

  const createDashbord = useCallback(() => {
    const dashboardId = uuid();
    dispatch(createDashboard(dashboardId));
  }, []);

  const isEmptyProject = dashboardsLoaded && dashboards.length === 0;

  return (
    <div>
      <ManagementNavigation
        attractNewDashboardButton={isEmptyProject}
        onCreateDashboard={createDashbord}
      />
      <Content>
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
        <CreateFirstDashboard
          onClick={createDashbord}
          isVisible={isEmptyProject}
        />
      </Content>
    </div>
  );
};

export default Management;
