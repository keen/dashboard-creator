import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { Theme } from '@keen.io/charts';

import { Container } from './MainSettings.styles';
import ColorManager from '../ColorManager';
import DashboardPage from '../DashboardPage';
import WidgetTiles from '../WidgetTiles';
import SettingsDivider from '../SettingsDivider';

import {
  themeSelectors,
  ThemeSettings,
  CUSTOM_COLOR_PALETTE,
} from '../../../../modules/theme';
import { DashboardSettings } from '../../../../modules/dashboards';

type Props = {
  /** Curent theme settings */
  currentSettings: ThemeSettings;
  /** Update theme settings event handler */
  onUpdateSettings: (
    theme: Partial<Theme>,
    dashboardSettings: Partial<DashboardSettings>
  ) => void;
};

const MainSettings: FC<Props> = ({ currentSettings, onUpdateSettings }) => {
  const { theme, settings } = currentSettings;
  const { colors: defaultColors } = useSelector(themeSelectors.getBaseTheme);
  return (
    <Container>
      <ColorManager
        defaultColors={defaultColors}
        colorPaletteName={settings.colorPalette}
        colors={theme.colors}
        onUpdateColors={(colors: string[]) =>
          onUpdateSettings({ colors }, { colorPalette: CUSTOM_COLOR_PALETTE })
        }
        onSelectPalette={(colorPalette: string, colors: string[]) =>
          onUpdateSettings(
            {
              colors,
            },
            {
              colorPalette,
            }
          )
        }
      />
      <SettingsDivider />
      <DashboardPage
        onUpdateSettings={(pageSettings) =>
          onUpdateSettings(theme, { ...pageSettings })
        }
        settings={settings}
      />
      <SettingsDivider />
      <WidgetTiles
        onUpdateSettings={(pageSettings) =>
          onUpdateSettings(theme, { ...pageSettings })
        }
        settings={settings}
        colors={theme.colors}
      />
    </Container>
  );
};
export default MainSettings;
