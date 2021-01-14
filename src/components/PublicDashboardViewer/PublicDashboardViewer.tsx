import React, { FC } from 'react';
import { useSelector } from 'react-redux';

import { Navigation, Container, Content } from './PublicDashboardViewer.styles';

import { getDashboard, getDashboardMeta } from '../../modules/dashboards';

import Grid from '../Grid';

import { RootState } from '../../rootReducer';

type Props = {
  /** Dashboard identifer */
  dashboardId: string;
};

const PublicDashboardViewer: FC<Props> = ({ dashboardId }) => {
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
        <Navigation>{metadata && metadata.title}</Navigation>
        {error && <div>{error}</div>}
        {isInitialized && !error && (
          <Grid isEditorMode={false} widgetsId={widgetsId} />
        )}
      </Content>
    </Container>
  );
};

export default PublicDashboardViewer;
