import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import deepMerge from 'deepmerge';
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
import { transformDotNotationToNested } from '../../../../utils';

type Props = {
  /** Current theme settings */
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
        currentSettings={currentSettings}
        colorPaletteName={settings.colorPalette}
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
        onUpdateSettings={(pageSettings, themeSettings = {}) => {
          const formattedThemeSettings = transformDotNotationToNested(
            themeSettings
          );
          const mergedTheme = deepMerge(theme, formattedThemeSettings);

          onUpdateSettings(mergedTheme, { ...pageSettings });
        }}
        settings={settings}
        currentSettings={currentSettings}
      />
      <SettingsDivider />
      <WidgetTiles
        onUpdateSettings={(pageSettings) =>
          onUpdateSettings(theme, { ...pageSettings })
        }
        settings={settings}
        currentSettings={currentSettings}
      />
    </Container>
  );
};
export default MainSettings;
