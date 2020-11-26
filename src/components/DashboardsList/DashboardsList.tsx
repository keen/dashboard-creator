import React, { FC } from 'react';

import { DashboardsGrid, DashboardItem } from './DashboardsList.styles';
import DashboardTile from '../DashboardTile';

import { DashboardMetaData } from '../../modules/dashboards';

type Props = {
  /** Collection of dashboards */
  dashboards: DashboardMetaData[];
  /** Edit dashboard event handler */
  onEditDashboard: (id: string) => void;
  /** Preview dashboard event handler */
  onPreviewDashboard: (id: string) => void;
  /** Show dashboard settings event handler */
  onShowDashboardSettings: (id: string) => void;
};

const DashboardsList: FC<Props> = ({
  dashboards,
  onPreviewDashboard,
  onShowDashboardSettings,
  onEditDashboard,
}) => {
  return (
    <DashboardsGrid>
      {dashboards.map(({ id, widgets }) => (
        <DashboardItem key={id}>
          <DashboardTile
            id={id}
            title="Dashboard Title"
            lastModificationDate="15/03/2020"
            queriesCount={18}
            onPreview={() => onPreviewDashboard(id)}
            onEdit={() => onEditDashboard(id)}
            onShowSettings={() => onShowDashboardSettings(id)}
            useDefaultThumbnail={widgets === 0}
          />
        </DashboardItem>
      ))}
    </DashboardsGrid>
  );
};

export default DashboardsList;
