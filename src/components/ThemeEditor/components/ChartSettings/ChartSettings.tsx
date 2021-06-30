import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { Theme } from '@keen.io/charts';
import { themeSelectors, ThemeSettings } from '../../../../modules/theme';
import { DashboardSettings } from '../../../../modules/dashboards';
import SettingsDivider from '../SettingsDivider';
import { Container } from './ChartSettings.styles';
import { Grid, Legend, Titles, Tooltip, XAxis, YAxis } from './components';

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

  return (
    <Container>
      <Titles
        settings={chartSettings}
        onChange={(settings) =>
          onUpdateSettings(theme, {
            title: settings.title,
            subtitle: settings.subtitle,
          })
        }
      />
      <SettingsDivider />
      <Legend
        settings={chartSettings}
        onChange={(settings) => {
          onUpdateSettings(theme, {
            legend: settings,
          });
        }}
      />
      <SettingsDivider />
      <Grid
        settings={theme}
        colorSuggestions={defaultColors}
        onChange={(settings) => {
          onUpdateSettings(
            {
              gridX: settings.gridX,
              gridY: settings.gridY,
            },
            chartSettings
          );
        }}
      />
      <SettingsDivider />
      <XAxis
        settings={theme}
        onChange={(settings) => {
          onUpdateSettings({ axisX: settings }, chartSettings);
        }}
      />
      <SettingsDivider />
      <YAxis
        settings={theme}
        onChange={(settings) => {
          onUpdateSettings({ axisY: settings }, chartSettings);
        }}
      />
      <SettingsDivider />
      <Tooltip settings={{}} onChange={() => console.log('change')} />
    </Container>
  );
};
export default ChartSettings;
