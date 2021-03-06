import React, { FC } from 'react';

import { DashboardsGrid, DashboardItem } from './DashboardsList.styles';
import DashboardTile from '../DashboardTile';

import { DashboardMetaData } from '../../modules/dashboards';

type Props = {
  /** Collection of dashboards */
  dashboards: DashboardMetaData[];
  /** Preview dashboard event handler */
  onPreviewDashboard: (id: string) => void;
  /** Show dashboard settings event handler */
  onShowDashboardSettings: (id: string) => void;
};

const DashboardsList: FC<Props> = ({
  dashboards,
  onPreviewDashboard,
  onShowDashboardSettings,
}) => {
  return (
    <DashboardsGrid data-testid="dashboards-grid">
      {dashboards.map(
        ({
          id,
          title,
          widgets,
          queries,
          tags,
          lastModificationDate,
          isPublic,
        }) => (
          <DashboardItem key={id} data-testid="dashboard-item">
            <DashboardTile
              id={id}
              title={title}
              lastModificationDate={new Date(
                lastModificationDate
              ).toLocaleDateString()}
              queriesCount={queries}
              onPreview={() => onPreviewDashboard(id)}
              onShowSettings={() => onShowDashboardSettings(id)}
              useDefaultThumbnail={widgets === 0}
              tags={tags}
              isPublic={isPublic}
            />
          </DashboardItem>
        )
      )}
    </DashboardsGrid>
  );
};

export default DashboardsList;
