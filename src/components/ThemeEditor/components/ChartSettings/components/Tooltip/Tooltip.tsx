import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { BodyText } from '@keen.io/typography';
import {
  RadioSelect,
  TypographySettings,
  FontSettings,
  TooltipMode,
} from '@keen.io/ui-core';
import { Tooltip as TooltipType } from '@keen.io/charts';
import { colors } from '@keen.io/colors';

import { mapInputTypographySettings } from '../../../../utils';

import SettingsHeadline from '../../../SettingsHeadline';
import Section, { SectionRow, TextWrapper } from '../../../Section';

import {
  COLOR_MODES_ITEMS,
  AVAILABLE_SETTINGS,
  FONT_SIZE_SETTINGS,
  COLOR_MODE,
} from './constants';

type Props = {
  settings: TooltipType;
  onChange: (newSettings: TooltipType) => void;
};

const Tooltip: FC<Props> = ({ settings, onChange }) => {
  const { t } = useTranslation();

  const labelTypography = settings.labels.typography;
  const mappedLabelTypography = mapInputTypographySettings(
    labelTypography
  ) as FontSettings;

  const onLabelSettingsChange = ({ size }: FontSettings) => {
    const newSettings: TooltipType = {
      ...settings,
      labels: {
        ...settings.labels,
        typography: {
          ...settings.labels.typography,
          fontSize: size,
        },
      },
      values: {
        ...settings.values,
        typography: {
          ...settings.values.typography,
          fontSize: size,
        },
      },
    };
    onChange(newSettings);
  };

  const onColorModeSettingsChange = (mode: TooltipMode) => {
    const fontColor =
      mode === 'light' ? colors.black['500'] : colors.white['500'];

    const newSettings: TooltipType = {
      ...settings,
      labels: {
        ...settings.labels,
        typography: {
          ...settings.labels.typography,
          fontColor,
        },
      },
      values: {
        ...settings.values,
        typography: {
          ...settings.values.typography,
          fontColor,
        },
      },
      mode,
    };
    onChange(newSettings);
  };

  return (
    <Section data-testid="tooltip-settings">
      <SettingsHeadline title={'Tooltip'} />
      <div>
        <SectionRow>
          <TextWrapper>
            <BodyText variant="body2" fontWeight="bold">
              {t('theme_editor.tooltip_color_mode')}
            </BodyText>
          </TextWrapper>
          <RadioSelect
            activeItem={settings.mode}
            items={COLOR_MODES_ITEMS}
            onClick={(item) => onColorModeSettingsChange(COLOR_MODE[item.id])}
          />
        </SectionRow>
        <SectionRow>
          <TextWrapper>
            <BodyText variant="body2" fontWeight="bold">
              {t('theme_editor.tooltip_text_size')}
            </BodyText>
          </TextWrapper>
          <TypographySettings
            settings={mappedLabelTypography}
            availableSettings={AVAILABLE_SETTINGS}
            fontSizeSuggestions={FONT_SIZE_SETTINGS}
            onChange={(settings) => onLabelSettingsChange(settings)}
          />
        </SectionRow>
      </div>
    </Section>
  );
};

export default Tooltip;
