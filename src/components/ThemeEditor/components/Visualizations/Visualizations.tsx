import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { Theme } from '@keen.io/charts';

import { CircularChart } from './components';

import { ThemeSettings, themeSelectors } from '../../../../modules/theme';
import { DashboardSettings } from '../../../../modules/dashboards';

type Props = {
  /** Current theme settings */
  currentSettings: ThemeSettings;
  /** Update theme settings event handler */
  onUpdateSettings: (
    theme: Partial<Theme>,
    dashboardSettings: Partial<DashboardSettings>
  ) => void;
};

const Visualizations: FC<Props> = ({ currentSettings, onUpdateSettings }) => {
  const {
    theme: { donut, pie },
    settings: dashboardSettings,
  } = currentSettings;

  const { colors: defaultColors } = useSelector(themeSelectors.getBaseTheme);

  return (
    <div>
      <CircularChart
        settings={{ pie, donut }}
        onChange={(themeSettings) =>
          onUpdateSettings(themeSettings, dashboardSettings)
        }
        colorSuggestions={defaultColors}
      />
    </div>
  );
};

export default Visualizations;
