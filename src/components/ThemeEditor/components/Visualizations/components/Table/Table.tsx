import React, { FC, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { BodyText } from '@keen.io/typography';
import { Color, TypographySettings } from '@keen.io/ui-core';
import { Theme } from '@keen.io/charts';

import SettingsHeadline from '../../../SettingsHeadline';
import Section, { SectionRow, TextWrapper } from '../../../Section';

import { ThemeModalContext } from '../../../../../ThemeEditorModal/ThemeEditorModal';

import {
  mapInputTypographySettings,
  mapOutputTypographySettings,
} from '../../../../utils';

import { TABLE_FONT_SIZES } from './constants';

type Props = {
  /** Table chart theme settings */
  settings: Theme['table'];
  /** Color suggestions used in color picker */
  colorSuggestions: string[];
  /** Change event handler */
  onChange: (settings: Theme['table']) => void;
};

/* TODO: Capitalize labels */
const Table: FC<Props> = ({ settings, colorSuggestions, onChange }) => {
  const { t } = useTranslation();
  const { modalContentRef } = useContext(ThemeModalContext);

  const { header, body, mainColor } = settings;

  return (
    <Section>
      <SettingsHeadline title={t('theme_editor.table_title')} />
      <div>
        <SectionRow data-testid="table-color">
          <TextWrapper>
            <BodyText variant="body2" fontWeight="bold">
              {t('theme_editor.table_color')}
            </BodyText>
          </TextWrapper>
          <Color
            scrollableContainerRef={modalContentRef}
            color={mainColor}
            colorSuggestions={colorSuggestions}
            onColorChange={(color) =>
              onChange({
                ...settings,
                mainColor: color,
              })
            }
          />
        </SectionRow>
        <SectionRow data-testid="table-header">
          <TextWrapper>
            <BodyText variant="body2" fontWeight="bold">
              {t('theme_editor.table_header_labels')}
            </BodyText>
          </TextWrapper>
          <TypographySettings
            scrollableContainerRef={modalContentRef}
            colorSuggestions={colorSuggestions}
            settings={mapInputTypographySettings(header.typography)}
            fontSizeSuggestions={TABLE_FONT_SIZES}
            availableSettings={{
              fontSize: true,
              bold: true,
              italic: true,
              color: true,
            }}
            onChange={(typographySettings) =>
              onChange({
                ...settings,
                header: {
                  typography: mapOutputTypographySettings(typographySettings),
                },
              })
            }
          />
        </SectionRow>
        <SectionRow data-testid="table-values">
          <TextWrapper>
            <BodyText variant="body2" fontWeight="bold">
              {t('theme_editor.table_body_values')}
            </BodyText>
          </TextWrapper>
          <TypographySettings
            scrollableContainerRef={modalContentRef}
            colorSuggestions={colorSuggestions}
            settings={mapInputTypographySettings(body.typography)}
            fontSizeSuggestions={TABLE_FONT_SIZES}
            availableSettings={{
              fontSize: true,
              bold: true,
              italic: true,
              color: true,
            }}
            onChange={(typographySettings) =>
              onChange({
                ...settings,
                body: {
                  typography: mapOutputTypographySettings(typographySettings),
                },
              })
            }
          />
        </SectionRow>
      </div>
    </Section>
  );
};

export default Table;
