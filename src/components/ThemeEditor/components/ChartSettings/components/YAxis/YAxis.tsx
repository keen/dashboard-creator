import SettingsHeadline from '../../../SettingsHeadline';
import Section, { SectionRow, TextWrapper } from '../../../Section';
import { BodyText } from '@keen.io/typography';
import { TypographySettings } from '@keen.io/ui-core';
import React, { FC } from 'react';
import { FontSettings } from '@keen.io/ui-core/typings/components/typography-settings/types';

type Props = {
  settings: any; // todo
  onChange: (newSettings: any) => void;
};

const YAxis: FC<Props> = ({ settings, onChange }) => {
  const labelTypography = settings.labels.typography;

  const mappedSettings = {
    label: {
      color: labelTypography.fontColor,
      size: labelTypography.fontSize,
      bold: labelTypography.fontWeight === 'bold',
      italic: labelTypography.fontStyle === 'italic',
      underline: false, // ??
      alignment: 'left', // ??
    },
  } as any; // todo export Axis type

  const onLabelSettingsChange = (changes: FontSettings) => {
    const newSettings = {
      ...settings,
      labels: {
        typography: {
          ...settings.labels.typography,
          fontColor: changes.color,
          fontSize: changes.size,
        },
      },
    };
    onChange(newSettings);
  };

  return (
    <Section>
      <SettingsHeadline title={'Y-Axis'} />
      <div>
        <SectionRow>
          <TextWrapper>
            <BodyText variant="body2" fontWeight="bold">
              Labels
            </BodyText>
          </TextWrapper>
          <TypographySettings
            settings={mappedSettings.label}
            onChange={(settings) => onLabelSettingsChange(settings)}
          />
        </SectionRow>
      </div>
    </Section>
  );
};

export default YAxis;
