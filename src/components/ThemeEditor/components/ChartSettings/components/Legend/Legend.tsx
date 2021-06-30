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

const Legend: FC<Props> = ({ settings, onChange }) => {
  const legendTypography = settings.typography;

  const mappedSettings = {
    label: {
      color: legendTypography.fontColor,
      size: legendTypography.fontSize,
      bold: legendTypography.fontWeight === 'bold',
      italic: legendTypography.fontStyle === 'italic',
      underline: false, // ??
      alignment: 'left', // ??
    },
  } as any; // todo export Axis type

  const onSettingsChange = (changes: FontSettings) => {
    const newSettings = {
      ...settings,
      typography: {
        ...settings.typography,
        fontColor: changes.color,
        fontSize: changes.size,
        // todo
      },
    };
    console.log('newSettings', newSettings);
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
            settings={mappedSettings.label}
            onChange={(settings) => {
              onSettingsChange(settings);
            }}
          />
        </SectionRow>
      </div>
    </Section>
  );
};

export default Legend;
