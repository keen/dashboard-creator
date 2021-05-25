import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import SettingsHeadline from '../SettingsHeadline';

import { DashboardSettings } from '../../../../modules/dashboards';

type Props = {
  /** Dashboard page settings */
  settings: Pick<DashboardSettings, 'page'>;
  /** Update dashboard settings event handler */
  onUpdateSettings: (settings: Partial<DashboardSettings>) => void;
};

const DashboardPage: FC<Props> = ({ settings, onUpdateSettings }) => {
  const { t } = useTranslation();
  const {
    page: { gridGap },
  } = settings;

  return (
    <div>
      <SettingsHeadline title={t('theme_editor.dashboard_page_title')} />
      <div>{gridGap}</div>
      <div
        onClick={() =>
          onUpdateSettings({ page: { ...settings.page, gridGap: 40 } })
        }
      >
        Set Grid Gap 40
      </div>
    </div>
  );
};

export default DashboardPage;
