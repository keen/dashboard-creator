import React, { FC } from 'react';
import { BodyText } from '@keen.io/typography';
import { TypographySettings } from '@keen.io/ui-core';
import { FontSettings } from '@keen.io/ui-core/typings/components/typography-settings/types';

import {
  mapInputTypographySettings,
  mapOutputTypographySettings,
} from '../../utils';
import Section, { SectionRow, TextWrapper } from '../../../Section';
import SettingsHeadline from '../../../SettingsHeadline';
import { DashboardSettings } from '../../../../../../modules/dashboards';

type Props = {
  settings: DashboardSettings;
  onChange: (newSettings) => void;
};

const Legend: FC<Props> = ({ settings, onChange }) => {
  const legendTypography = settings.legend.typography;

  const labelTypographySettings = mapInputTypographySettings(
    legendTypography
  ) as FontSettings;

  const onSettingsChange = (changes: FontSettings) => {
    const newSettings = {
      ...settings,
      typography: {
        ...settings.legend.typography,
        ...mapOutputTypographySettings(changes),
      },
    };
    onChange(newSettings);
  };

  return (
    <Section>
      <SettingsHeadline title={'Legend'} />
      <div>
        <SectionRow>
          <TextWrapper>
            <BodyText variant="body2" fontWeight="bold">
              Labels
            </BodyText>
          </TextWrapper>
          <TypographySettings
            settings={labelTypographySettings}
            onChange={(settings) => onSettingsChange(settings)}
          />
        </SectionRow>
      </div>
    </Section>
  );
};

export default Legend;
