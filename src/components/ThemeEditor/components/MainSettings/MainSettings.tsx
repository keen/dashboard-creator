import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { Theme } from '@keen.io/charts';

import { Container } from './MainSettings.styles';
import ColorPalette from '../ColorPalette';

import {
  themeSelectors,
  ThemeSettings,
  CUSTOM_COLOR_THEME,
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
      <ColorPalette
        defaultColors={defaultColors}
        colorPaletteName={settings.colorPalette}
        colors={theme.colors}
        onUpdateColors={(colors) =>
          onUpdateSettings({ colors }, { colorPalette: CUSTOM_COLOR_THEME })
        }
        onUpdatePalette={(colorPalette, colors) =>
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
    </Container>
  );
};
export default MainSettings;
