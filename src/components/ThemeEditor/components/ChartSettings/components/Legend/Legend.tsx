import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { TypographySettings, FontSettings } from '@keen.io/ui-core';
import { BodyText } from '@keen.io/typography';

import { DashboardSettings } from '../../../../../../modules/dashboards';

import Section, { SectionRow, TextWrapper } from '../../../Section';
import SettingsHeadline from '../../../SettingsHeadline';

import {
  mapInputTypographySettings,
  mapOutputTypographySettings,
} from '../../utils';

type Props = {
  /* Legend settings */
  settings: Pick<DashboardSettings, 'legend'>;
  /* Change event handler */
  onChange: (settings: DashboardSettings['legend']) => void;
};

const Legend: FC<Props> = ({ settings, onChange }) => {
  const { t } = useTranslation();
  const legendTypography = settings.legend.typography;

  const labelTypographySettings = mapInputTypographySettings(legendTypography);

  const onSettingsChange = (changes: FontSettings) => {
    const newSettings = {
      ...settings.legend,
      typography: {
        ...settings.legend.typography,
        ...mapOutputTypographySettings(changes),
      },
    };
    onChange(newSettings);
  };

  return (
    <Section data-testid="legend-settings">
      <SettingsHeadline title={t('theme_editor.widget_legend_title')} />
      <div>
        <SectionRow>
          <TextWrapper>
            <BodyText variant="body2" fontWeight="bold">
              {t('theme_editor.legend_labels')}
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
