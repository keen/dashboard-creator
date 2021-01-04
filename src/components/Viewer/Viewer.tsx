import React, { FC } from 'react';
import { push } from 'connected-react-router';
import { useDispatch, useSelector } from 'react-redux';

import { Navigation } from './Viewer.styles';

import {
  getDashboard,
  getDashboardMeta,
  editDashboard,
} from '../../modules/dashboards';
import { setActiveDashboard } from '../../modules/app';

import Grid from '../Grid';
import ViewerNavigation from '../ViewerNavigation';

import { ROUTES } from '../../constants';
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

  const { title, tags } = useSelector((state: RootState) =>
    getDashboardMeta(state, dashboardId)
  );

  return (
    <>
      <Navigation>
        <ViewerNavigation
          title={title}
          tags={tags}
          onEditDashboard={() => dispatch(editDashboard(dashboardId))}
          onBack={() => {
            dispatch(setActiveDashboard(null));
            dispatch(push(ROUTES.MANAGEMENT));
          }}
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
