import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { AnimatePresence } from 'framer-motion';
import { Title } from '@keen.io/ui-core';
import { colors } from '@keen.io/colors';

import {
  ErrorContainer,
  Message,
  Navigation,
  Container,
  Content,
} from './PublicDashboardViewer.styles';

import { getDashboard, getDashboardMeta } from '../../modules/dashboards';
import { modalMotion } from './motion';

import Grid from '../Grid';
import GridPlaceholder from '../GridPlaceholder';
import DashboardDetails from '../DashboardDetails';

import { RootState } from '../../rootReducer';

import { DASHBOARD_ERROR } from './constants';

type Props = {
  /** Dashboard identifer */
  dashboardId: string;
};

const PublicDashboardViewer: FC<Props> = ({ dashboardId }) => {
  const { t } = useTranslation();
  const { widgetsId, isInitialized, error } = useSelector(
    (state: RootState) => {
      const dashboard = getDashboard(state, dashboardId);
      if (dashboard) {
        const { initialized, error } = dashboard;
        return {
          isInitialized: initialized,
          error,
          widgetsId: dashboard.settings?.widgets,
        };
      }

      return {
        widgetsId: [],
        error: null,
        isInitialized: false,
      };
    }
  );

  const metadata = useSelector((state: RootState) =>
    getDashboardMeta(state, dashboardId)
  );

  return (
    <Container>
      <Content>
        <Navigation>
          {metadata && (
            <DashboardDetails
              title={metadata.title}
              useDashboardSwitcher={false}
            />
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
          <Grid isEditorMode={false} widgetsId={widgetsId} />
        )}
      </Content>
    </Container>
  );
};

export default PublicDashboardViewer;
