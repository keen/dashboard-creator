import React, { FC } from 'react';
import { BodyText } from '@keen.io/typography';
import { TypographySettings } from '@keen.io/ui-core';
import { FontSettings } from '@keen.io/ui-core/typings/components/typography-settings/types';
import { Theme } from '@keen.io/charts';

import {
  mapInputTypographySettings,
  mapOutputTypographySettings,
} from '../../utils';
import SettingsHeadline from '../../../SettingsHeadline';
import Section, { SectionRow, TextWrapper } from '../../../Section';

type Props = {
  settings: Partial<Theme>;
  onChange: (newSettings) => void;
};

const XAxis: FC<Props> = ({ settings, onChange }) => {
  const labelTypography = settings.axisX.labels.typography;
  const mappedLabelTypography = mapInputTypographySettings(
    labelTypography
  ) as FontSettings;

  const onLabelSettingsChange = (changes: FontSettings) => {
    const newSettings = {
      ...settings,
      labels: {
        typography: {
          ...settings.axisX.labels.typography,
          ...mapOutputTypographySettings(changes),
        },
      },
    };
    onChange(newSettings);
  };

  return (
    <Section>
      <SettingsHeadline title={'X-Axis'} />
      <div>
        <SectionRow>
          <TextWrapper>
            <BodyText variant="body2" fontWeight="bold">
              Labels
            </BodyText>
          </TextWrapper>
          <TypographySettings
            settings={mappedLabelTypography}
            onChange={(settings) => onLabelSettingsChange(settings)}
          />
        </SectionRow>
      </div>
    </Section>
  );
};

export default XAxis;
