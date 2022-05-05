import React, { FC } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { AnimatePresence } from 'framer-motion';
import { Title } from '@keen.io/ui-core';
import { BodyText } from '@keen.io/typography';
import { colors } from '@keen.io/colors';

import {
  ErrorContainer,
  Message,
  Navigation,
  Container,
  Content,
  DropdownContainer,
  ClearFilters,
} from './PublicDashboardViewer.styles';

import { themeSelectors } from '../../modules/theme';
import { modalMotion } from './motion';

import Grid from '../Grid';
import GridPlaceholder from '../GridPlaceholder';
import DashboardDetails from '../DashboardDetails';

import { RootState } from '../../rootReducer';

import { DASHBOARD_ERROR } from './constants';
import { queriesSelectors } from '../../modules/queries';
import {
  dashboardsActions,
  dashboardsSelectors,
} from '../../modules/dashboards';

type Props = {
  /** Dashboard identifer */
  dashboardId: string;
};

const PublicDashboardViewer: FC<Props> = ({ dashboardId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    widgetsId,
    isInitialized,
    gridGap,
    pageBackground,
    error,
  } = useSelector((state: RootState) => {
    const dashboard = dashboardsSelectors.getDashboard(state, dashboardId);
    const themeSettings = themeSelectors.getThemeByDashboardId(
      state,
      dashboardId
    );

    if (dashboard && themeSettings) {
      const { initialized, error } = dashboard;
      const {
        settings: {
          page: { gridGap, background },
        },
      } = themeSettings;

      return {
        isInitialized: initialized,
        error,
        pageBackground: background,
        widgetsId: dashboard.settings?.widgets,
        gridGap,
      };
    }

    return {
      widgetsId: [],
      error: dashboard?.error,
      gridGap: null,
      pageBackground: null,
      isInitialized: false,
    };
  });

  const metadata = useSelector((state: RootState) =>
    dashboardsSelectors.getDashboardMeta(state, dashboardId)
  );
  const hasInterimQueries = useSelector((state: RootState) => {
    const interimQueriesLength = queriesSelectors.getInterimQueriesLength(
      state
    );
    return !!interimQueriesLength;
  });

  return (
    <Container background={pageBackground}>
      <Content>
        <Navigation>
          {metadata && (
            <DashboardDetails
              title={metadata.title}
              useDashboardSwitcher={false}
            />
          )}
          {hasInterimQueries && (
            <ClearFilters
              onClick={() =>
                dispatch(dashboardsActions.resetDashboardFilters(dashboardId))
              }
            >
              <BodyText
                variant="body2"
                fontWeight="bold"
                color={colors.blue[500]}
              >
                {t('viewer.clear_filters')}
              </BodyText>
            </ClearFilters>
          )}
        </Navigation>
        <AnimatePresence>
          {error && (
            <ErrorContainer {...modalMotion}>
              <Title variant="h3" color={colors.red[500]}>
                {t('public_dashboard_errors.generic_title')}
              </Title>
              <Message>{t(DASHBOARD_ERROR[error])}</Message>
            </ErrorContainer>
          )}
        </AnimatePresence>
        {error && <GridPlaceholder />}
        {isInitialized && !error && (
          <Grid isEditorMode={false} gridGap={gridGap} widgetsId={widgetsId} />
        )}
      </Content>
      <DropdownContainer id="dropdown-container" />
    </Container>
  );
};

export default PublicDashboardViewer;
