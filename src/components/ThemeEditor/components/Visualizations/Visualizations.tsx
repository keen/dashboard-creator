import React, { FC } from 'react';
import { Theme } from '@keen.io/charts';

import {
  CircularChart,
  Funnel,
  Metric,
  Table,
  Line,
  Gauge,
} from './components';
import SettingsDivider from '../SettingsDivider';

import { ThemeSettings, getColorSuggestions } from '../../../../modules/theme';
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
    theme: { donut, pie, funnel, metric, table, line, colors, gauge },
    settings: dashboardSettings,
  } = currentSettings;

  const colorSuggestions = getColorSuggestions(colors, currentSettings);

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
        colorSuggestions={colorSuggestions}
      />
      <SettingsDivider />
      <Funnel
        settings={funnel}
        onChange={(funnelSettings) =>
          onUpdateSettings({ funnel: funnelSettings }, dashboardSettings)
        }
        colorSuggestions={colorSuggestions}
      />
      <SettingsDivider />
      <Metric
        settings={metric}
        onChange={(metricSettings) =>
          onUpdateSettings({ metric: metricSettings }, dashboardSettings)
        }
        colorSuggestions={colorSuggestions}
      />
      <SettingsDivider />
      <Table
        settings={table}
        onChange={(tableSettings) =>
          onUpdateSettings({ table: tableSettings }, dashboardSettings)
        }
        colorSuggestions={colorSuggestions}
      />
      <SettingsDivider />
      <Gauge
        settings={gauge}
        onChange={(gaugeSettings) =>
          onUpdateSettings({ gauge: gaugeSettings }, dashboardSettings)
        }
        colorSuggestions={colorSuggestions}
      />
    </div>
  );
};

export default Visualizations;
