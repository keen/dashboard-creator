import SettingsHeadline from '../../../SettingsHeadline';
import Section, { SectionRow, TextWrapper } from '../../../Section';
import { BodyText } from '@keen.io/typography';
import React, { FC } from 'react';

type Props = {
  settings: any; // todo
  onChange: (newSettings: any) => void;
};

const Tooltip: FC<Props> = () => {
  return (
    <Section>
      <SettingsHeadline title={'Tooltip'} />
      <div>
        <SectionRow>
          <TextWrapper>
            <BodyText variant="body2" fontWeight="bold">
              Color mode
            </BodyText>
          </TextWrapper>
          todo
        </SectionRow>
        <SectionRow>
          <TextWrapper>
            <BodyText variant="body2" fontWeight="bold">
              Text size
            </BodyText>
          </TextWrapper>
          todo
        </SectionRow>
      </div>
    </Section>
  );
};

export default Tooltip;
