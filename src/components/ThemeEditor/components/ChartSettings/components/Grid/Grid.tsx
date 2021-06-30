import SettingsHeadline from '../../../SettingsHeadline';
import Section, { SectionRow, TextWrapper } from '../../../Section';
import { BodyText } from '@keen.io/typography';
import { Color } from '@keen.io/ui-core';
import React, { FC } from 'react';

type Props = {
  color: string;
  colorSuggestions: string[];
  onChange: (newSettings: any) => void;
};

const Grid: FC<Props> = ({ color, colorSuggestions, onChange }) => {
  return (
    <Section>
      <SettingsHeadline title={'Grid'} />
      <div>
        <SectionRow>
          <TextWrapper>
            <BodyText variant="body2" fontWeight="bold">
              Color
            </BodyText>
          </TextWrapper>
          <Color
            color={color}
            colorSuggestions={colorSuggestions}
            onColorChange={(newSettings) => onChange(newSettings)}
          />
        </SectionRow>
      </div>
    </Section>
  );
};

export default Grid;
