import React, { FC, useContext, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  DropableContainer,
  Dropdown,
  DynamicPortal,
  Toggle,
} from '@keen.io/ui-core';
import { BodyText } from '@keen.io/typography';
import { colors as keenColors } from '@keen.io/colors/dist/colors';
import {
  useDynamicContentPosition,
  useOnParentScroll,
} from '@keen.io/react-hooks';

import SettingsHeadline from '../SettingsHeadline';
import Section, { SectionRow, TextWrapper } from '../Section';
import { ColorSelector } from '../ColorSelector';
import ThemeSlider, { generateRulerSettings } from '../ThemeSlider';

import { DashboardSettings } from '../../../../modules/dashboards';
import { themeSelectors, getColorSuggestions } from '../../../../modules/theme';

import {
  BorderOption,
  BorderWidthDropdownWrapper,
  BorderSettingsWrapper,
  DropdownWrapper,
} from './WidgetTiles.styles';
import {
  TILE_BORDER_WIDTHS,
  SPACING_INTERVALS,
  ROUNDING_INTERVALS,
} from '../../constants';
import { ThemeModalContext } from '../../../ThemeEditorModal/ThemeEditorModal';

type Props = {
  /** Dashboard page settings */
  settings: Pick<DashboardSettings, 'tiles' | 'colorPalette'>;
  /** Update dashboard settings event handler */
  onUpdateSettings: (settings: Partial<DashboardSettings>) => void;
  colors: string[];
};

const WidgetTiles: FC<Props> = ({ settings, onUpdateSettings, colors }) => {
  const { t } = useTranslation();
  const { modalContentRef } = useContext(ThemeModalContext);

  const borderWidthDropdownContainerRef = useRef(null);

  const {
    tiles: {
      background,
      borderColor,
      borderWidth,
      borderRadius,
      padding,
      hasShadow,
    },
  } = settings;

  const currentEditTheme = useSelector(themeSelectors.getCurrentEditTheme);
  const colorSuggestions = getColorSuggestions(colors, currentEditTheme);
  const [borderWidthDropdownIsOpen, setBorderWidthDropdownIsOpen] = useState(
    false
  );

  const {
    setPosition: setBorderWidthDropdownPosition,
    contentPosition: borderWidthDropdownPosition,
  } = useDynamicContentPosition(borderWidthDropdownContainerRef);

  useOnParentScroll(modalContentRef, () => setBorderWidthDropdownIsOpen(false));

  return (
    <Section>
      <SettingsHeadline title={t('theme_editor.widget_tiles_title')} />
      <div>
        <SectionRow>
          <TextWrapper>
            <BodyText variant="body2" fontWeight="bold">
              {t('theme_editor.tile_color')}
            </BodyText>
          </TextWrapper>
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
        </SectionRow>
        <SectionRow>
          <TextWrapper>
            <BodyText variant="body2" fontWeight="bold">
              {t('theme_editor.border')}
            </BodyText>
          </TextWrapper>
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
            <BorderWidthDropdownWrapper ref={borderWidthDropdownContainerRef}>
              <DropableContainer
                isActive={borderWidthDropdownIsOpen}
                onClick={() => {
                  setBorderWidthDropdownPosition();
                  setBorderWidthDropdownIsOpen(!borderWidthDropdownIsOpen);
                }}
                onDefocus={() => setBorderWidthDropdownIsOpen(false)}
                dropIndicator
                variant="secondary"
                value={borderWidth.toString()}
              >
                {borderWidth}
              </DropableContainer>
              <DynamicPortal>
                <DropdownWrapper
                  x={borderWidthDropdownPosition.x}
                  y={borderWidthDropdownPosition.y}
                >
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
                </DropdownWrapper>
              </DynamicPortal>
            </BorderWidthDropdownWrapper>
          </BorderSettingsWrapper>
        </SectionRow>
        <SectionRow alignItems="flex-start">
          <TextWrapper>
            <BodyText variant="body2" fontWeight="bold">
              {t('theme_editor.corner_rounding')}
            </BodyText>
          </TextWrapper>
          <ThemeSlider
            initialValue={borderRadius}
            intervals={ROUNDING_INTERVALS}
            ticks={generateRulerSettings({
              minimum: ROUNDING_INTERVALS[0].minimum,
              maximum: ROUNDING_INTERVALS[0].maximum,
              step: 2,
            })}
            onChange={(radius) =>
              onUpdateSettings({
                tiles: {
                  ...settings.tiles,
                  borderRadius: radius,
                },
              })
            }
          />
        </SectionRow>
        <SectionRow alignItems="flex-start">
          <TextWrapper>
            <BodyText variant="body2" fontWeight="bold">
              {t('theme_editor.inner_margin')}
            </BodyText>
          </TextWrapper>
          <ThemeSlider
            initialValue={padding}
            intervals={SPACING_INTERVALS}
            ticks={generateRulerSettings({
              minimum: SPACING_INTERVALS[0].minimum,
              maximum: SPACING_INTERVALS[0].maximum,
              step: 5,
            })}
            onChange={(padding) =>
              onUpdateSettings({
                tiles: {
                  ...settings.tiles,
                  padding,
                },
              })
            }
          />
        </SectionRow>
        <SectionRow>
          <TextWrapper>
            <BodyText variant="body2" fontWeight="bold">
              {t('theme_editor.shadow')}
            </BodyText>
          </TextWrapper>
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
        </SectionRow>
      </div>
    </Section>
  );
};

export default WidgetTiles;
