import React, { FC, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { BodyText } from '@keen.io/typography';
import { Color, TypographySettings } from '@keen.io/ui-core';
import { Theme } from '@keen.io/charts';

import SettingsHeadline from '../../../SettingsHeadline';
import Section, { SectionRow, TextWrapper } from '../../../Section';

import { ThemeModalContext } from '../../../../../ThemeEditorModal/ThemeEditorModal';

import {
  mapInputTypographySettings,
  mapOutputTypographySettings,
} from '../../../../utils';

import { GAUGE_RANGE_FONT_SIZES, GAUGE_TOTAL_FONT_SIZES } from './constants';

type Props = {
  /** Table chart theme settings */
  settings: Theme['gauge'];
  /** Color suggestions used in color picker */
  colorSuggestions: string[];
  /** Change event handler */
  onChange: (settings: Theme['gauge']) => void;
};

const Gauge: FC<Props> = ({ settings, colorSuggestions, onChange }) => {
  const { t } = useTranslation();
  const { modalContentRef } = useContext(ThemeModalContext);

  const {
    labels,
    border: { backgroundColor },
    total,
  } = settings;

  return (
    <Section>
      <SettingsHeadline title={t('theme_editor.gauge_title')} />
      <div>
        <SectionRow data-testid="gauge-primary-value">
          <TextWrapper>
            <BodyText variant="body2" fontWeight="bold">
              {t('theme_editor.gauge_primary_value')}
            </BodyText>
          </TextWrapper>
          <TypographySettings
            scrollableContainerRef={modalContentRef}
            colorSuggestions={colorSuggestions}
            settings={mapInputTypographySettings(total.typography)}
            fontSizeSuggestions={GAUGE_TOTAL_FONT_SIZES}
            availableSettings={{
              fontSize: true,
              bold: true,
              italic: true,
              color: true,
            }}
            onChange={(typographySettings) =>
              onChange({
                ...settings,
                total: {
                  ...settings.total,
                  typography: mapOutputTypographySettings(typographySettings),
                },
              })
            }
          />
        </SectionRow>
        <SectionRow data-testid="gauge-range-values">
          <TextWrapper>
            <BodyText variant="body2" fontWeight="bold">
              {t('theme_editor.gauge_range_values')}
            </BodyText>
          </TextWrapper>
          <TypographySettings
            scrollableContainerRef={modalContentRef}
            colorSuggestions={colorSuggestions}
            settings={mapInputTypographySettings(labels.typography)}
            fontSizeSuggestions={GAUGE_RANGE_FONT_SIZES}
            availableSettings={{
              fontSize: true,
              bold: true,
              italic: true,
              color: true,
            }}
            onChange={(typographySettings) =>
              onChange({
                ...settings,
                labels: {
                  ...settings.labels,
                  typography: mapOutputTypographySettings(typographySettings),
                },
              })
            }
          />
        </SectionRow>
        <SectionRow data-testid="gauge-border-color">
          <TextWrapper>
            <BodyText variant="body2" fontWeight="bold">
              {t('theme_editor.gauge_border_color')}
            </BodyText>
          </TextWrapper>
          <Color
            scrollableContainerRef={modalContentRef}
            color={backgroundColor}
            colorSuggestions={colorSuggestions}
            onColorChange={(color) =>
              onChange({
                ...settings,
                border: {
                  backgroundColor: color,
                },
              })
            }
          />
        </SectionRow>
      </div>
    </Section>
  );
};

export default Gauge;
