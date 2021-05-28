import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import SettingsHeadline from '../SettingsHeadline';

import { DashboardSettings } from '../../../../modules/dashboards';
import { ColorSelector } from '../ColorSelector';
import { SettingsCategory } from '../SettingsCategory';
import { SettingsSubcategory } from '../SettingsSubCategory';
import { useSelector } from 'react-redux';
import { themeSelectors } from '../../../../modules/theme';

import { DropableContainer, Dropdown, Toggle } from '@keen.io/ui-core';
import { BodyText } from '@keen.io/typography';
import { colors as keenColors } from '@keen.io/colors/dist/colors';
import {
  BorderOption,
  BorderWidthDropdownWrapper,
  BorderSettingsWrapper,
} from './WidgetTiles.styles';
import { getColorSuggestions } from '../../utils';
import { TILE_BORDER_WIDTHS } from '../../constants';

type Props = {
  /** Dashboard page settings */
  settings: Pick<DashboardSettings, 'tiles' | 'colorPalette'>;
  /** Update dashboard settings event handler */
  onUpdateSettings: (settings: Partial<DashboardSettings>) => void;
  colors: string[];
};

const WidgetTiles: FC<Props> = ({ settings, onUpdateSettings, colors }) => {
  const { t } = useTranslation();
  const {
    tiles: { background, borderColor, borderWidth, hasShadow },
  } = settings;

  const currentEditTheme = useSelector(themeSelectors.getCurrentEditTheme);
  const colorSuggestions = getColorSuggestions(colors, currentEditTheme);
  const [borderWidthDropdownIsOpen, setBorderWidthDropdownIsOpen] = useState(
    false
  );

  return (
    <SettingsCategory
      title={<SettingsHeadline title={t('theme_editor.widget_tiles_title')} />}
    >
      <SettingsSubcategory title={'Tile color'}>
        <ColorSelector
          color={background}
          colorSuggestions={colorSuggestions}
          onColorChange={(color) =>
            onUpdateSettings({
              tiles: {
                ...settings.tiles,
                background: color,
              },
            })
          }
        />
      </SettingsSubcategory>

      <SettingsSubcategory title={'Border'}>
        <BorderSettingsWrapper>
          <ColorSelector
            color={borderColor}
            colorSuggestions={colorSuggestions}
            onColorChange={(color) =>
              onUpdateSettings({
                tiles: {
                  ...settings.tiles,
                  borderColor: color,
                },
              })
            }
          />
          <BorderWidthDropdownWrapper>
            <DropableContainer
              isActive={borderWidthDropdownIsOpen}
              onClick={() =>
                !borderWidthDropdownIsOpen && setBorderWidthDropdownIsOpen(true)
              }
              onDefocus={() => setBorderWidthDropdownIsOpen(false)}
              dropIndicator
              variant="secondary"
              value={borderWidth.toString()}
            >
              {borderWidth}
            </DropableContainer>
            <Dropdown isOpen={borderWidthDropdownIsOpen} fullWidth={true}>
              {TILE_BORDER_WIDTHS.map((borderWidth, index) => (
                <BorderOption
                  key={borderWidth + index}
                  onClick={() =>
                    onUpdateSettings({
                      tiles: {
                        ...settings.tiles,
                        borderWidth: borderWidth,
                      },
                    })
                  }
                >
                  <BodyText variant="body2" color={keenColors.blue[500]}>
                    {borderWidth}
                  </BodyText>
                </BorderOption>
              ))}
            </Dropdown>
          </BorderWidthDropdownWrapper>
        </BorderSettingsWrapper>
      </SettingsSubcategory>

      <SettingsSubcategory title={'Corner Rounding'}>
        Slider
      </SettingsSubcategory>

      <SettingsSubcategory title={'Inner Margin'}>Slider</SettingsSubcategory>

      <SettingsSubcategory title={'Shadow'}>
        <Toggle
          isOn={hasShadow}
          onChange={(isSet) =>
            onUpdateSettings({
              tiles: {
                ...settings.tiles,
                hasShadow: isSet,
              },
            })
          }
        />
      </SettingsSubcategory>
    </SettingsCategory>
  );
};

export default WidgetTiles;
