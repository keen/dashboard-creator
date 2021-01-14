import React, { FC } from 'react';
import { push } from 'connected-react-router';
import { useDispatch, useSelector } from 'react-redux';

import { Navigation } from './Viewer.styles';

import {
  getDashboard,
  getDashboardMeta,
  editDashboard,
  showDashboardSettingsModal,
} from '../../modules/dashboards';
import { setActiveDashboard, getUser } from '../../modules/app';

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

  const { editPrivileges } = useSelector(getUser);
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
            dispatch(showDashboardSettingsModal(dashboardId));
          }}
          editPrivileges={editPrivileges}
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
