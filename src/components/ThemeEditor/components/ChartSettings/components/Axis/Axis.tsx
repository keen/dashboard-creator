import React, { FC, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { TypographySettings, FontSettings } from '@keen.io/ui-core';
import { BodyText } from '@keen.io/typography';
import { Axis } from '@keen.io/charts';

import {
  mapInputTypographySettings,
  mapOutputTypographySettings,
} from '../../../../utils';

import SettingsHeadline from '../../../SettingsHeadline';
import Section, { SectionRow, TextWrapper } from '../../../Section';
import { ThemeModalContext } from '../../../../../ThemeEditorModal/ThemeEditorModal';

import {
  AVAILABLE_FONT_SIZES,
  AXIS_LABELS_SETTINGS,
  AXIS_TITLES_SETTINGS,
} from './constants';

type Props = {
  /** Axis  settings */
  settings: Axis;
  /** Change event handler */
  onChange: (settings: Axis) => void;
  /** Section title */
  sectionTitle: string;
};

const XAxis: FC<Props> = ({ sectionTitle, settings, onChange }) => {
  const { t } = useTranslation();
  const { modalContentRef } = useContext(ThemeModalContext);

  const labelTypography = settings.labels.typography;
  const titlesTypography = settings.title.typography;

  const mappedLabelTypography = mapInputTypographySettings(
    labelTypography
  ) as FontSettings;

  const onTitleSettingsChange = (changes: FontSettings) => {
    const newSettings: Axis = {
      ...settings,
      title: {
        ...settings.title,
        typography: {
          ...settings.title.typography,
          ...mapOutputTypographySettings(changes),
        },
      },
    };
    onChange(newSettings);
  };

  const onLabelSettingsChange = (changes: FontSettings) => {
    const newSettings: Axis = {
      ...settings,
      labels: {
        ...settings.labels,
        typography: {
          ...settings.labels.typography,
          ...mapOutputTypographySettings(changes),
        },
      },
    };
    onChange(newSettings);
  };

  return (
    <Section data-testid="axis-settings">
      <SettingsHeadline title={sectionTitle} />
      <div>
        <SectionRow data-testid="axis-labels-settings">
          <TextWrapper>
            <BodyText variant="body2" fontWeight="bold">
              {t('theme_editor.axis_labels')}
            </BodyText>
          </TextWrapper>
          <TypographySettings
            scrollableContainerRef={modalContentRef}
            settings={mappedLabelTypography}
            fontSizeSuggestions={AVAILABLE_FONT_SIZES}
            availableSettings={AXIS_LABELS_SETTINGS}
            onChange={(settings) => onLabelSettingsChange(settings)}
          />
        </SectionRow>
        <SectionRow data-testid="axis-titles-settings">
          <TextWrapper>
            <BodyText variant="body2" fontWeight="bold">
              {t('theme_editor.axis_titles')}
            </BodyText>
          </TextWrapper>
          <TypographySettings
            scrollableContainerRef={modalContentRef}
            settings={mapInputTypographySettings(titlesTypography)}
            fontSizeSuggestions={AVAILABLE_FONT_SIZES}
            availableSettings={AXIS_TITLES_SETTINGS}
            onChange={(settings) => onTitleSettingsChange(settings)}
          />
        </SectionRow>
      </div>
    </Section>
  );
};

export default XAxis;
