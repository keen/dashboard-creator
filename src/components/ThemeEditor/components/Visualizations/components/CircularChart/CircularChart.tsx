import React, { FC, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { BodyText } from '@keen.io/typography';
import { TypographySettings } from '@keen.io/ui-core';
import { Theme } from '@keen.io/charts';

import SettingsHeadline from '../../../SettingsHeadline';
import Section, { SectionRow, TextWrapper } from '../../../Section';

import { ThemeModalContext } from '../../../../../ThemeEditorModal/ThemeEditorModal';

import {
  mapInputTypographySettings,
  mapOutputTypographySettings,
} from '../../../../utils';

import {
  TOTAL_VALUE_FONT_SIZES,
  TOTAL_LABEL_FONT_SIZES,
  VALUES_FONT_SIZES,
} from './constants';

type Props = {
  /** Donut and pie chart settings */
  settings: Pick<Theme, 'donut' | 'pie'>;
  /** Color suggestions used in color picker */
  colorSuggestions: string[];
  /** Change event handler */
  onChange: (settings: Partial<Pick<Theme, 'donut' | 'pie'>>) => void;
};

const CircularChart: FC<Props> = ({ settings, colorSuggestions, onChange }) => {
  const { t } = useTranslation();
  const { modalContentRef } = useContext(ThemeModalContext);

  const {
    donut: { labels, total },
  } = settings;

  return (
    <Section>
      <SettingsHeadline title={t('theme_editor.circular_chart_title')} />
      <div>
        <SectionRow data-testid="circular-chart-values">
          <TextWrapper>
            <BodyText variant="body2" fontWeight="bold">
              {t('theme_editor.circular_chart_values')}
            </BodyText>
          </TextWrapper>
          <TypographySettings
            scrollableContainerRef={modalContentRef}
            colorSuggestions={colorSuggestions}
            settings={mapInputTypographySettings(labels.typography)}
            fontSizeSuggestions={VALUES_FONT_SIZES}
            availableSettings={{ bold: true, italic: true, fontSize: true }}
            onChange={(typographySettings) => {
              const mappedLabelsTypography = mapOutputTypographySettings(
                typographySettings
              );
              const updatedSettings: Partial<Theme> = {
                pie: {
                  labels: {
                    ...settings.pie.labels,
                    typography: mappedLabelsTypography,
                  },
                },
                donut: {
                  ...settings.donut,
                  labels: {
                    ...settings.donut.labels,
                    typography: mappedLabelsTypography,
                  },
                },
              };

              onChange(updatedSettings);
            }}
          />
        </SectionRow>
        <SectionRow data-testid="donut-total-label">
          <TextWrapper>
            <BodyText variant="body2" fontWeight="bold">
              {t('theme_editor.circular_chart_total_label')}
            </BodyText>
          </TextWrapper>
          <TypographySettings
            scrollableContainerRef={modalContentRef}
            colorSuggestions={colorSuggestions}
            settings={mapInputTypographySettings(total.label.typography)}
            fontSizeSuggestions={TOTAL_LABEL_FONT_SIZES}
            availableSettings={{
              color: true,
              bold: true,
              italic: true,
              fontSize: true,
            }}
            onChange={(typographySettings) => {
              const updatedSettings = {
                pie: {
                  ...settings.pie,
                },
                donut: {
                  ...settings.donut,
                  total: {
                    ...settings.donut.total,
                    label: {
                      ...settings.donut.total.label,
                      typography: mapOutputTypographySettings(
                        typographySettings
                      ),
                    },
                  },
                },
              };

              onChange(updatedSettings);
            }}
          />
        </SectionRow>
        <SectionRow data-testid="donut-total-value">
          <TextWrapper>
            <BodyText variant="body2" fontWeight="bold">
              {t('theme_editor.circular_total_value')}
            </BodyText>
          </TextWrapper>
          <TypographySettings
            scrollableContainerRef={modalContentRef}
            colorSuggestions={colorSuggestions}
            settings={mapInputTypographySettings(total.value.typography)}
            fontSizeSuggestions={TOTAL_VALUE_FONT_SIZES}
            availableSettings={{
              color: true,
              bold: true,
              italic: true,
              fontSize: true,
            }}
            onChange={(typographySettings) => {
              const updatedSettings = {
                pie: {
                  ...settings.pie,
                },
                donut: {
                  ...settings.donut,
                  total: {
                    ...settings.donut.total,
                    value: {
                      ...settings.donut.total.value,
                      typography: mapOutputTypographySettings(
                        typographySettings
                      ),
                    },
                  },
                },
              };

              onChange(updatedSettings);
            }}
          />
        </SectionRow>
      </div>
    </Section>
  );
};

export default CircularChart;
