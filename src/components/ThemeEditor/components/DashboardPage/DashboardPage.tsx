import React, { FC, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { BodyText } from '@keen.io/typography';
import { Theme } from '@keen.io/charts';
import { Color } from '@keen.io/ui-core';

import SettingsHeadline from '../SettingsHeadline';
import FontSelector from '../FontSelector';
import Section, { SectionRow, TextWrapper } from '../Section';
import ThemeSlider, { generateRulerSettings } from '../ThemeSlider';

import { DashboardSettings } from '../../../../modules/dashboards';
import {
  themeSelectors,
  getColorSuggestions,
  getFontFallback,
  ThemeSettings,
} from '../../../../modules/theme';

import { getNestedObjectKeysAndValues } from '../../../../utils';

import { SPACING_INTERVALS } from '../../constants';
import { ThemeModalContext } from '../../../ThemeEditorModal/ThemeEditorModal';

type Props = {
  /** Dashboard page settings */
  settings: Pick<DashboardSettings, 'page' | 'title' | 'subtitle' | 'legend'>;
  /** Update dashboard settings event handler */
  onUpdateSettings: (
    settings: Partial<DashboardSettings>,
    theme?: Partial<Theme>
  ) => void;
  /** Current theme settings */
  currentSettings: ThemeSettings;
};

const DashboardPage: FC<Props> = ({
  settings,
  onUpdateSettings,
  currentSettings,
}) => {
  const { t } = useTranslation();
  const { theme } = useSelector(themeSelectors.getCurrentEditTheme);
  const { modalContentRef } = useContext(ThemeModalContext);

  const {
    page: { gridGap, chartTitlesFont, visualizationsFont, background },
  } = settings;

  const { keys } = getNestedObjectKeysAndValues(theme, (keychain) =>
    keychain.endsWith('fontFamily')
  );

  const colorSuggestions = getColorSuggestions(
    currentSettings.theme.colors,
    currentSettings
  );

  return (
    <Section>
      <SettingsHeadline title={t('theme_editor.dashboard_page_title')} />
      <div>
        <SectionRow>
          <TextWrapper>
            <BodyText variant="body2" fontWeight="bold">
              {t('theme_editor.background_color')}
            </BodyText>
          </TextWrapper>
          <Color
            color={background}
            scrollableContainerRef={modalContentRef}
            colorSuggestions={colorSuggestions}
            onColorChange={(color) =>
              onUpdateSettings({
                page: {
                  ...settings.page,
                  background: color,
                },
              })
            }
          />
        </SectionRow>
        <SectionRow>
          <TextWrapper>
            <BodyText variant="body2" fontWeight="bold">
              {t('theme_editor.chart_titles_font')}
            </BodyText>
          </TextWrapper>
          <FontSelector
            font={chartTitlesFont}
            onChange={(font) =>
              onUpdateSettings({
                page: { ...settings.page, chartTitlesFont: font },
              })
            }
          />
        </SectionRow>
        <SectionRow>
          <TextWrapper>
            <BodyText variant="body2" fontWeight="bold">
              {t('theme_editor.data_visualization_font')}
            </BodyText>
          </TextWrapper>
          <FontSelector
            font={visualizationsFont}
            onChange={(font) => {
              const fontFallback = getFontFallback(font);
              const themeWithFallbackFonts = keys.reduce((acc, key) => {
                acc[key] = fontFallback;
                return acc;
              }, {});
              onUpdateSettings(
                {
                  page: {
                    ...settings.page,
                    visualizationsFont: font,
                  },
                  legend: {
                    ...settings.legend,
                    typography: {
                      ...settings.legend.typography,
                      fontFamily: fontFallback,
                    },
                  },
                  title: {
                    ...settings.title,
                    typography: {
                      ...settings.title.typography,
                      fontFamily: fontFallback,
                    },
                  },
                  subtitle: {
                    ...settings.subtitle,
                    typography: {
                      ...settings.subtitle.typography,
                      fontFamily: fontFallback,
                    },
                  },
                },
                themeWithFallbackFonts
              );
            }}
          />
        </SectionRow>
        <SectionRow>
          <TextWrapper>
            <BodyText variant="body2" fontWeight="bold">
              {t('theme_editor.space_between_widgets')}
            </BodyText>
          </TextWrapper>
          <ThemeSlider
            initialValue={gridGap}
            intervals={SPACING_INTERVALS}
            ticks={generateRulerSettings({
              minimum: SPACING_INTERVALS[0].minimum,
              maximum: SPACING_INTERVALS[0].maximum,
              step: 5,
            })}
            onChange={(gridGap) =>
              onUpdateSettings({ page: { ...settings.page, gridGap } })
            }
          />
        </SectionRow>
      </div>
    </Section>
  );
};

export default DashboardPage;
