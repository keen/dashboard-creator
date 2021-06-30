import SettingsHeadline from '../../../SettingsHeadline';
import Section, { SectionRow, TextWrapper } from '../../../Section';
import { BodyText } from '@keen.io/typography';
import { Color } from '@keen.io/ui-core';
import React, { FC } from 'react';
import { Theme } from '@keen.io/charts';

type Props = {
  settings: Partial<Theme>;
  colorSuggestions: string[];
  onChange: (settings) => void;
};

const Grid: FC<Props> = ({ settings, colorSuggestions, onChange }) => {
  const onColorChange = (color) => {
    onChange({
      gridX: { ...settings.gridX, color },
      gridY: { ...settings.gridY, color },
    });
  };
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
            color={settings.gridX.color}
            colorSuggestions={colorSuggestions}
            onColorChange={(color) => onColorChange(color)}
          />
        </SectionRow>
      </div>
    </Section>
  );
};

export default Grid;
