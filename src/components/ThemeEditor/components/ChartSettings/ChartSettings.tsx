import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Theme } from '@keen.io/charts';

import { Container } from './ChartSettings.styles';
import { Grid, Legend, Titles, Tooltip, Axis } from './components';

import SettingsDivider from '../SettingsDivider';

import { themeSelectors, ThemeSettings } from '../../../../modules/theme';
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

const ChartSettings: FC<Props> = ({ currentSettings, onUpdateSettings }) => {
  const { t } = useTranslation();

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
      <Axis
        settings={theme.axisX}
        sectionTitle={t('theme_editor.widget_x_axis_title')}
        onChange={(settings) => {
          onUpdateSettings({ axisX: settings }, chartSettings);
        }}
      />
      <SettingsDivider />
      <Axis
        settings={theme.axisY}
        sectionTitle={t('theme_editor.widget_y_axis_title')}
        onChange={(settings) => {
          onUpdateSettings({ axisY: settings }, chartSettings);
        }}
      />
      <SettingsDivider />
      <Tooltip
        settings={theme.tooltip}
        onChange={(settings) => {
          onUpdateSettings({ tooltip: settings }, chartSettings);
        }}
      />
    </Container>
  );
};
export default ChartSettings;
