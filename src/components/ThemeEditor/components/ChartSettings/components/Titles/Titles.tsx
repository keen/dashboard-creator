import SettingsHeadline from '../../../SettingsHeadline';
import Section, { SectionRow, TextWrapper } from '../../../Section';
import { BodyText } from '@keen.io/typography';
import { TypographySettings } from '@keen.io/ui-core';
import React, { FC } from 'react';

type Props = {
  settings: any; // todo
  onChange: (newSettings: any) => void;
};

const Titles: FC<Props> = ({ settings }) => {
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
            settings={settings}
            onChange={(settings) => {
              console.log('sad', settings);
            }}
          />
        </SectionRow>
        <SectionRow>
          <TextWrapper>
            <BodyText variant="body2" fontWeight="bold">
              Subtitle
            </BodyText>
          </TextWrapper>
          <TypographySettings
            settings={settings}
            onChange={(settings) => {
              console.log('sad', settings);
            }}
          />
        </SectionRow>
      </div>
    </Section>
  );
};

export default Titles;
