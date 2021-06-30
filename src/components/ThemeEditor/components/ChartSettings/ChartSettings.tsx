import React, { FC } from 'react';
import SettingsDivider from '../SettingsDivider';
import { Container } from './ChartSettings.styles';

import { FontSettings } from '@keen.io/ui-core/typings/components/typography-settings/types';
import { Grid, Legend, Titles, Tooltip, XAxis, YAxis } from './components';
import { themeSelectors, ThemeSettings } from '../../../../modules/theme';
import { Theme } from '@keen.io/charts';
import { DashboardSettings } from '../../../../modules/dashboards';
import { useSelector } from 'react-redux';
import deepMerge from 'deepmerge';

type Props = {
  /** Current theme settings */
  currentSettings: ThemeSettings;
  /** Update theme settings event handler */
  onUpdateSettings: (
    theme: Partial<Theme>,
    dashboardSettings: Partial<DashboardSettings>
  ) => void;
};

const ChartSettings: FC<Props> = ({ currentSettings, onUpdateSettings }) => {
  const { theme, settings: chartSettings } = currentSettings;
  const { colors: defaultColors } = useSelector(themeSelectors.getBaseTheme);

  console.log('currentSettings', currentSettings);

  const settings = {
    color: 'blue',
    size: 12,
    bold: false,
    italic: true,
    underline: false,
    alignment: 'left',
  } as FontSettings;

  return (
    <Container>
      <Titles settings={settings} onChange={() => console.log('change')} />
      <SettingsDivider />
      <Legend
        settings={chartSettings.legend}
        onChange={(newSettings) => {
          const mergedChartSettings = deepMerge(chartSettings, {
            legend: { ...chartSettings.legend, ...newSettings },
          });
          onUpdateSettings(theme, mergedChartSettings);
        }}
      />
      <SettingsDivider />
      <Grid
        color={theme.gridX.color}
        colorSuggestions={defaultColors}
        onChange={(color) => {
          const mergedTheme = deepMerge(theme, {
            gridX: { ...theme.gridX, color },
            gridY: { ...theme.gridY, color },
          }); //update theme settings
          onUpdateSettings(mergedTheme, chartSettings);
        }}
      />
      <SettingsDivider />
      <XAxis
        settings={theme.axisX}
        onChange={(newSettings) => {
          const mergedTheme = deepMerge(theme, {
            axisX: { ...theme.axisX, ...newSettings },
          });
          onUpdateSettings(mergedTheme, chartSettings);
        }}
      />
      <SettingsDivider />
      <YAxis
        settings={theme.axisY}
        onChange={(newSettings) => {
          const mergedTheme = deepMerge(theme, {
            axisY: { ...theme.axisY, ...newSettings },
          });
          onUpdateSettings(mergedTheme, chartSettings);
        }}
      />
      <SettingsDivider />
      <Tooltip settings={settings} onChange={() => console.log('change')} />
    </Container>
  );
};
export default ChartSettings;
