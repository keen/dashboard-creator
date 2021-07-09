import React, { FC, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { TypographySettings, FontSettings } from '@keen.io/ui-core';
import { BodyText } from '@keen.io/typography';

import { DashboardSettings } from '../../../../../../modules/dashboards';

import Section, { SectionRow, TextWrapper } from '../../../Section';
import SettingsHeadline from '../../../SettingsHeadline';

import {
  mapInputTypographySettings,
  mapOutputTypographySettings,
} from '../../../../utils';

import { ThemeModalContext } from '../../../../../ThemeEditorModal/ThemeEditorModal';

import { AVAILABLE_FONT_SIZES, LEGEND_LABELS_SETTINGS } from './constants';

type Props = {
  /* Legend settings */
  settings: Pick<DashboardSettings, 'legend'>;
  /* Change event handler */
  onChange: (settings: DashboardSettings['legend']) => void;
};

const Legend: FC<Props> = ({ settings, onChange }) => {
  const { t } = useTranslation();
  const { modalContentRef } = useContext(ThemeModalContext);

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
            scrollableContainerRef={modalContentRef}
            settings={labelTypographySettings}
            fontSizeSuggestions={AVAILABLE_FONT_SIZES}
            availableSettings={LEGEND_LABELS_SETTINGS}
            onChange={(settings) => onSettingsChange(settings)}
          />
        </SectionRow>
      </div>
    </Section>
  );
};

export default Legend;
