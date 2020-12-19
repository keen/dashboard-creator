import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Navigation } from './Viewer.styles';

import { getDashboard, editDashboard } from '../../modules/dashboards';

import Grid from '../Grid';
import ViewerNavigation from '../ViewerNavigation';

import { RootState } from '../../rootReducer';

type Props = {
  /** Dashboard identifer */
  dashboardId: string;
};

const Viewer: FC<Props> = ({ dashboardId }) => {
  const dispatch = useDispatch();

  const { widgetsId, isInitialized } = useSelector((state: RootState) => {
    const dashboard = getDashboard(state, dashboardId);
    if (dashboard?.initialized) {
      return {
        isInitialized: true,
        widgetsId: dashboard.settings.widgets,
      };
    }

    return {
      widgetsId: [],
      isInitialized: false,
    };
  });

  return (
    <>
      <Navigation>
        <ViewerNavigation
          onEditDashboard={() => dispatch(editDashboard(dashboardId))}
          onShowSettings={() => {
            console.log('onShowDashboardSettings');
          }}
          editPrivileges
        />
      </Navigation>
      {isInitialized ? (
        <>
          <Grid isEditorMode={false} widgetsId={widgetsId} />
        </>
      ) : (
        <div>Loading</div>
      )}
    </>
  );
};

export default Viewer;
