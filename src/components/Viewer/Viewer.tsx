import React, { FC, useEffect } from 'react';
import { push } from 'connected-react-router';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { colors } from '@keen.io/colors';
import { Headline, BodyText } from '@keen.io/typography';

import { Navigation, Error, Content } from './Viewer.styles';

import {
  dashboardsSelectors,
  editDashboard,
  resetDashboardFilters,
  showDashboardSettingsModal,
} from '../../modules/dashboards';
import { themeSelectors } from '../../modules/theme';
import { Scopes } from '../../modules/app';

import Grid from '../Grid';
import GridLoader from '../GridLoader';
import ViewerNavigation from '../ViewerNavigation';
import DashboardDeleteConfirmation from '../DashboardDeleteConfirmation';

import { ROUTES } from '../../constants';
import { RootState } from '../../rootReducer';

import { appActions, appSelectors } from '../../modules/app';

type Props = {
  /** Dashboard identifer */
  dashboardId: string;
};

const Viewer: FC<Props> = ({ dashboardId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { permissions: userPermissions } = useSelector(appSelectors.getUser);
  const isDashboardsInitiallyLoaded = useSelector(
    dashboardsSelectors.getDashboardsLoadState
  );

  const { error, widgetsId, isInitialized, gridGap } = useSelector(
    (state: RootState) => {
      const dashboard = dashboardsSelectors.getDashboard(state, dashboardId);
      const themeSettings = themeSelectors.getThemeByDashboardId(
        state,
        dashboardId
      );

      if (dashboard?.initialized && themeSettings) {
        const {
          settings: {
            page: { gridGap },
          },
        } = themeSettings;

        return {
          isInitialized: true,
          gridGap: gridGap,
          error: dashboard.error,
          widgetsId: dashboard.settings.widgets,
        };
      }

      return {
        isInitialized: false,
        error: dashboard?.error,
        gridGap: null,
        widgetsId: [],
      };
    }
  );

  const { title, tags, isPublic } = useSelector((state: RootState) => {
    const dashboardMeta = dashboardsSelectors.getDashboardMeta(
      state,
      dashboardId
    );
    if (dashboardMeta) return dashboardMeta;

    return {
      title: null,
      isPublic: false,
      tags: [],
    };
  });

  useEffect(() => {
    return () => {
      dispatch(resetDashboardFilters(dashboardId));
    };
  }, [dashboardId]);

  return (
    <>
      {isDashboardsInitiallyLoaded && !error && (
        <Navigation>
          <ViewerNavigation
            dashboardId={dashboardId}
            title={title}
            tags={tags}
            isPublic={isPublic}
            onEditDashboard={() => dispatch(editDashboard(dashboardId))}
            onBack={() => {
              dispatch(appActions.setActiveDashboard(null));
              dispatch(push(ROUTES.MANAGEMENT));
            }}
            onShowSettings={() => {
              dispatch(showDashboardSettingsModal(dashboardId));
            }}
          />
        </Navigation>
      )}
      <Content>
        {error ? (
          <Error>
            <Headline variant="h3" color={colors.red[500]}>
              {t('viewer.generic_error_title')}
            </Headline>
            <BodyText variant="body1">
              {t('viewer.view_dashboard_error_message')}
            </BodyText>
          </Error>
        ) : (
          <>
            {isInitialized ? (
              <>
                <Grid
                  isEditorMode={false}
                  gridGap={gridGap}
                  widgetsId={widgetsId}
                />
              </>
            ) : (
              <GridLoader />
            )}
          </>
        )}
      </Content>
      {userPermissions.includes(Scopes.EDIT_DASHBOARD) && (
        <>
          <DashboardDeleteConfirmation />
        </>
      )}
    </>
  );
};

export default Viewer;
