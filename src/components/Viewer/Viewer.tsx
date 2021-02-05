import React, { FC, useEffect } from 'react';
import { push } from 'connected-react-router';
import { useDispatch, useSelector } from 'react-redux';

import { Navigation, Content } from './Viewer.styles';

import {
  getDashboard,
  getDashboardMeta,
  editDashboard,
  showDashboardSettingsModal,
} from '../../modules/dashboards';
import { setActiveDashboard, getUser } from '../../modules/app';
import { removeInterimQueries } from '../../modules/queries';
import { resetDatePickerWidgets } from '../../modules/widgets';

import Grid from '../Grid';
import GridLoader from '../GridLoader';
import ViewerNavigation from '../ViewerNavigation';
import DashboardDeleteConfirmation from '../DashboardDeleteConfirmation';

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

  const { title, tags, isPublic } = useSelector((state: RootState) =>
    getDashboardMeta(state, dashboardId)
  );

  useEffect(() => {
    return () => {
      dispatch(resetDatePickerWidgets(dashboardId));
      dispatch(removeInterimQueries());
    };
  }, [dashboardId]);

  return (
    <>
      <Navigation>
        <ViewerNavigation
          dashboardId={dashboardId}
          title={title}
          tags={tags}
          isPublic={isPublic}
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
      <Content>
        {isInitialized ? (
          <>
            <Grid isEditorMode={false} widgetsId={widgetsId} />
          </>
        ) : (
          <GridLoader />
        )}
      </Content>
      {editPrivileges && (
        <>
          <DashboardDeleteConfirmation />
        </>
      )}
    </>
  );
};

export default Viewer;
