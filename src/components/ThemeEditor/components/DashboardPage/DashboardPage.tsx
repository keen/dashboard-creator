import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { BodyText } from '@keen.io/typography';
import { Theme } from '@keen.io/charts';

import SettingsHeadline from '../SettingsHeadline';
import FontSelector from '../FontSelector';
import Section, { SectionRow, TextWrapper } from '../Section';
import ThemeSlider, { generateRulerSettings } from '../ThemeSlider';

import { DashboardSettings } from '../../../../modules/dashboards';
import { themeSelectors } from '../../../../modules/theme';

import { getFontFallback } from './utils';
import { getNestedObjectKeysAndValues } from '../../../../utils';

import { SPACING_INTERVALS } from '../../constants';

type Props = {
  /** Dashboard page settings */
  settings: Pick<DashboardSettings, 'page'>;
  /** Update dashboard settings event handler */
  onUpdateSettings: (
    settings: Partial<DashboardSettings>,
    theme?: Partial<Theme>
  ) => void;
};

const DashboardPage: FC<Props> = ({ settings, onUpdateSettings }) => {
  const { t } = useTranslation();
  const { theme } = useSelector(themeSelectors.getCurrentEditTheme);
  const {
    page: { gridGap, chartTitlesFont, visualizationsFont },
  } = settings;

  const { keys } = getNestedObjectKeysAndValues(theme, (keychain) =>
    keychain.endsWith('fontFamily')
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
          <div>color picker</div>
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
              const themeWithFallbackFonts = keys.reduce((acc, key) => {
                acc[key] = getFontFallback(font);
                return acc;
              }, {});

              onUpdateSettings(
                {
                  page: { ...settings.page, visualizationsFont: font },
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
