import React, { FC, useContext, useCallback } from 'react';
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

import {
  FUNNEL_TYPOGRAPHY_SETTINGS,
  VALUE_FONT_SIZES,
  LABEL_FONT_SIZES,
  BADGE_FONT_SIZES,
} from './constants';

type Props = {
  /** Funnel chart theme settings */
  settings: Theme['funnel'];
  /** Color suggestions used in color picker */
  colorSuggestions: string[];
  /** Change event handler */
  onChange: (settings: Theme['funnel']) => void;
};

const Funnel: FC<Props> = ({ settings, colorSuggestions, onChange }) => {
  const { t } = useTranslation();
  const { modalContentRef } = useContext(ThemeModalContext);

  const {
    step,
    header: { badge, value, title },
  } = settings;

  const updateFunnelSettings = useCallback(
    (
      property: keyof Theme['funnel']['header'],
      funnelSettings: Partial<Theme['funnel']['header']>
    ) => {
      const updatedSettings = {
        ...settings,
        header: {
          ...settings.header,
          [property]: funnelSettings[property],
        },
      };

      onChange(updatedSettings);
    },
    []
  );

  return (
    <Section>
      <SettingsHeadline title={t('theme_editor.funnel_title')} />
      <div>
        <SectionRow data-testid="funnel-steps-background">
          <TextWrapper>
            <BodyText variant="body2" fontWeight="bold">
              {t('theme_editor.funnel_steps_background')}
            </BodyText>
          </TextWrapper>
          <Color
            scrollableContainerRef={modalContentRef}
            color={step.backgroundColor}
            colorSuggestions={colorSuggestions}
            onColorChange={(color) =>
              onChange({
                ...settings,
                step: {
                  backgroundColor: color,
                },
              })
            }
          />
        </SectionRow>
        <SectionRow data-testid="funnel-value">
          <TextWrapper>
            <BodyText variant="body2" fontWeight="bold">
              {t('theme_editor.funnel_value')}
            </BodyText>
          </TextWrapper>
          <TypographySettings
            scrollableContainerRef={modalContentRef}
            colorSuggestions={colorSuggestions}
            settings={mapInputTypographySettings(value.typography)}
            fontSizeSuggestions={VALUE_FONT_SIZES}
            availableSettings={FUNNEL_TYPOGRAPHY_SETTINGS}
            onChange={(typographySettings) => {
              updateFunnelSettings('value', {
                value: {
                  ...settings.header.value,
                  typography: mapOutputTypographySettings(typographySettings),
                },
              });
            }}
          />
        </SectionRow>
        <SectionRow data-testid="funnel-label">
          <TextWrapper>
            <BodyText variant="body2" fontWeight="bold">
              {t('theme_editor.funnel_labels')}
            </BodyText>
          </TextWrapper>
          <TypographySettings
            scrollableContainerRef={modalContentRef}
            colorSuggestions={colorSuggestions}
            settings={mapInputTypographySettings(title.typography)}
            fontSizeSuggestions={LABEL_FONT_SIZES}
            availableSettings={FUNNEL_TYPOGRAPHY_SETTINGS}
            onChange={(typographySettings) => {
              updateFunnelSettings('title', {
                title: {
                  ...settings.header.title,
                  typography: mapOutputTypographySettings(typographySettings),
                },
              });
            }}
          />
        </SectionRow>
        <SectionRow data-testid="funnel-badge">
          <TextWrapper>
            <BodyText variant="body2" fontWeight="bold">
              {t('theme_editor.funnel_badge')}
            </BodyText>
          </TextWrapper>
          <TypographySettings
            scrollableContainerRef={modalContentRef}
            colorSuggestions={colorSuggestions}
            settings={mapInputTypographySettings(badge.typography)}
            fontSizeSuggestions={BADGE_FONT_SIZES}
            availableSettings={FUNNEL_TYPOGRAPHY_SETTINGS}
            onChange={(typographySettings) => {
              updateFunnelSettings('badge', {
                badge: {
                  ...settings.header.badge,
                  typography: mapOutputTypographySettings(typographySettings),
                },
              });
            }}
          />
        </SectionRow>
      </div>
    </Section>
  );
};

export default Funnel;
