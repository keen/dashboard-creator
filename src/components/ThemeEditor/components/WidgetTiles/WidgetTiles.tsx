import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import SettingsHeadline from '../SettingsHeadline';

import { DashboardSettings } from '../../../../modules/dashboards';

type Props = {
  /** Dashboard page settings */
  settings: Pick<DashboardSettings, 'tiles'>;
  /** Update dashboard settings event handler */
  onUpdateSettings: (settings: Partial<DashboardSettings>) => void;
};

const WidgetTiles: FC<Props> = ({ settings, onUpdateSettings }) => {
  const { t } = useTranslation();
  const {
    tiles: { background },
  } = settings;

  return (
    <div>
      <SettingsHeadline title={t('theme_editor.widget_tiles_title')} />
      Title Background: {background}
      <div
        onClick={() =>
          onUpdateSettings({
            tiles: {
              ...settings.tiles,
              background: '#F9C6D7',
            },
          })
        }
      >
        Set tile backround to #F9C6D7
      </div>
    </div>
  );
};

export default WidgetTiles;
