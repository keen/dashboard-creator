import React, { FC } from 'react';
import { BodyText } from '@keen.io/typography';
import { FontSettings } from '@keen.io/ui-core/typings/components/typography-settings/types';
import { TypographySettings } from '@keen.io/ui-core';

import {
  mapInputTypographySettings,
  mapOutputTypographySettings,
} from '../../utils';
import SettingsHeadline from '../../../SettingsHeadline';
import Section, { SectionRow, TextWrapper } from '../../../Section';
import { DashboardSettings } from '../../../../../../modules/dashboards';

type Props = {
  settings: DashboardSettings;
  onChange: (newSettings) => void;
};

const Titles: FC<Props> = ({ settings, onChange }) => {
  const titleTypography = settings.title.typography;
  const subtitleTypography = settings.subtitle.typography;

  const mappedSettings = {
    title: mapInputTypographySettings(titleTypography),
    subtitle: mapInputTypographySettings(subtitleTypography),
  } as {
    title: FontSettings;
    subtitle: FontSettings;
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
      <SettingsHeadline title={'Titles'} />
      <div>
        <SectionRow>
          <TextWrapper>
            <BodyText variant="body2" fontWeight="bold">
              Title
            </BodyText>
          </TextWrapper>
          <TypographySettings
            settings={mappedSettings.title}
            onChange={(settings) => onTitleSettingsChange(settings)}
          />
        </SectionRow>
        <SectionRow>
          <TextWrapper>
            <BodyText variant="body2" fontWeight="bold">
              Subtitle
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
