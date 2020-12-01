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
    <DashboardsGrid>
      {dashboards.map(({ id, widgets }) => (
        <DashboardItem key={id}>
          <DashboardTile
            id={id}
            title="Dashboard Title lorem ipsum suhgiuerghiewfjoiwejfiurgejrfiojeroigjeofijeoirjfoerihjgoi"
            lastModificationDate="15/03/2020"
            queriesCount={18}
            onPreview={() => onPreviewDashboard(id)}
            onShowSettings={() => onShowDashboardSettings(id)}
            useDefaultThumbnail={widgets === 0}
            onRemove={() => console.log('remove')}
            onClone={() => console.log('clone')}
            tags={['Sales', 'Marketing', 'Important', 'Review']}
            isPublic
          />
        </DashboardItem>
      ))}
    </DashboardsGrid>
  );
};

export default DashboardsList;
