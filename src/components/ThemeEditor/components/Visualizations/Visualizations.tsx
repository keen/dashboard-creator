import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { Theme } from '@keen.io/charts';

import { CircularChart, Funnel, Metric, Table, Line } from './components';
import SettingsDivider from '../SettingsDivider';

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
    theme: { donut, pie, funnel, metric, table, line },
    settings: dashboardSettings,
  } = currentSettings;

  const { colors: defaultColors } = useSelector(themeSelectors.getBaseTheme);

  return (
    <div>
      <Line
        settings={line}
        onChange={(themeSettings) =>
          onUpdateSettings({ line: themeSettings }, dashboardSettings)
        }
      />
      <SettingsDivider />
      <CircularChart
        settings={{ pie, donut }}
        onChange={(themeSettings) =>
          onUpdateSettings(themeSettings, dashboardSettings)
        }
        colorSuggestions={defaultColors}
      />
      <SettingsDivider />
      <Funnel
        settings={funnel}
        onChange={(funnelSettings) =>
          onUpdateSettings({ funnel: funnelSettings }, dashboardSettings)
        }
        colorSuggestions={defaultColors}
      />
      <SettingsDivider />
      <Metric
        settings={metric}
        onChange={(metricSettings) =>
          onUpdateSettings({ metric: metricSettings }, dashboardSettings)
        }
        colorSuggestions={defaultColors}
      />
      <SettingsDivider />
      <Table
        settings={table}
        onChange={(tableSettings) =>
          onUpdateSettings({ table: tableSettings }, dashboardSettings)
        }
        colorSuggestions={defaultColors}
      />
    </div>
  );
};

export default Visualizations;
