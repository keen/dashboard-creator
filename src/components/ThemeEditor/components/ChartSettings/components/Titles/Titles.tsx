import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { BodyText } from '@keen.io/typography';
import { TypographySettings, FontSettings } from '@keen.io/ui-core';

import { DashboardSettings } from '../../../../../../modules/dashboards';

import {
  mapInputTypographySettings,
  mapOutputTypographySettings,
} from '../../utils';

import SettingsHeadline from '../../../SettingsHeadline';
import Section, { SectionRow, TextWrapper } from '../../../Section';

type Props = {
  /* Title and subtitle settings */
  settings: Pick<DashboardSettings, 'title' | 'subtitle'>;
  /* Change event handler */
  onChange: (settings: Pick<DashboardSettings, 'title' | 'subtitle'>) => void;
};

const Titles: FC<Props> = ({ settings, onChange }) => {
  const { t } = useTranslation();

  const titleTypography = settings.title.typography;
  const subtitleTypography = settings.subtitle.typography;

  const mappedSettings = {
    title: mapInputTypographySettings(titleTypography),
    subtitle: mapInputTypographySettings(subtitleTypography),
  };

  const onTitleSettingsChange = (changes: FontSettings) => {
    const newSettings = {
      subtitle: settings.subtitle,
      title: {
        typography: {
          ...settings.title.typography,
          ...mapOutputTypographySettings(changes),
        },
      },
    };
    onChange(newSettings);
  };

  const onSubtitleSettingsChange = (changes: FontSettings) => {
    const newSettings = {
      title: settings.title,
      subtitle: {
        typography: {
          ...settings.subtitle.typography,
          ...mapOutputTypographySettings(changes),
        },
      },
    };
    onChange(newSettings);
  };

  return (
    <Section>
      <SettingsHeadline title={t('theme_editor.widget_titles_title')} />
      <div>
        <SectionRow data-testid="title-settings">
          <TextWrapper>
            <BodyText variant="body2" fontWeight="bold">
              {t('theme_editor.titles_title')}
            </BodyText>
          </TextWrapper>
          <TypographySettings
            settings={mappedSettings.title}
            onChange={(settings) => onTitleSettingsChange(settings)}
          />
        </SectionRow>
        <SectionRow data-testid="subtitle-settings">
          <TextWrapper>
            <BodyText variant="body2" fontWeight="bold">
              {t('theme_editor.titles_subtitle')}
            </BodyText>
          </TextWrapper>
          <TypographySettings
            settings={mappedSettings.subtitle}
            onChange={(settings) => onSubtitleSettingsChange(settings)}
          />
        </SectionRow>
      </div>
    </Section>
  );
};

export default Titles;
