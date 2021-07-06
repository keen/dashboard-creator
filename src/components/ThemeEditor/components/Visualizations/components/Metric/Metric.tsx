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

import { METRIC_TYPOGRAPHY_SETTINGS } from './constants';

type Props = {
  /** Metric chart theme settings */
  settings: Theme['metric'];
  /** Color suggestions used in color picker */
  colorSuggestions: string[];
  /** Change event handler */
  onChange: (settings: Theme['metric']) => void;
};

const Metric: FC<Props> = ({ settings, colorSuggestions, onChange }) => {
  const { t } = useTranslation();
  const { modalContentRef } = useContext(ThemeModalContext);

  const { value, excerpt } = settings;

  return (
    <Section>
      <SettingsHeadline title={t('theme_editor.metric_title')} />
      <div>
        <SectionRow data-testid="metric-primary-value">
          <TextWrapper>
            <BodyText variant="body2" fontWeight="bold">
              {t('theme_editor.metric_primary_value')}
            </BodyText>
          </TextWrapper>
          <TypographySettings
            scrollableContainerRef={modalContentRef}
            colorSuggestions={colorSuggestions}
            settings={mapInputTypographySettings(value.typography)}
            fontSizeSuggestions={[10, 12, 14]}
            availableSettings={METRIC_TYPOGRAPHY_SETTINGS}
            onChange={(typographySettings) =>
              onChange({
                ...settings,
                value: {
                  typography: mapOutputTypographySettings(typographySettings),
                },
              })
            }
          />
        </SectionRow>
        <SectionRow data-testid="metric-secondary-value">
          <TextWrapper>
            <BodyText variant="body2" fontWeight="bold">
              {t('theme_editor.metric_secondary_value')}
            </BodyText>
          </TextWrapper>
          <TypographySettings
            scrollableContainerRef={modalContentRef}
            colorSuggestions={colorSuggestions}
            settings={mapInputTypographySettings(excerpt.typography)}
            fontSizeSuggestions={[10, 12, 14]}
            availableSettings={METRIC_TYPOGRAPHY_SETTINGS}
            onChange={(typographySettings) =>
              onChange({
                ...settings,
                excerpt: {
                  ...settings.excerpt,
                  typography: mapOutputTypographySettings(typographySettings),
                },
              })
            }
          />
        </SectionRow>
      </div>
    </Section>
  );
};

export default Metric;
