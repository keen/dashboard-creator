import React, { FC, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { BodyText } from '@keen.io/typography';
import { Color } from '@keen.io/ui-core';
import { Theme } from '@keen.io/charts';

import SettingsHeadline from '../../../SettingsHeadline';
import Section, { SectionRow, TextWrapper } from '../../../Section';
import { ThemeModalContext } from '../../../../../ThemeEditorModal/ThemeEditorModal';

type Props = {
  /** Grid settings */
  settings: Pick<Theme, 'gridX' | 'gridY'>;
  /** Color suggestions used in color picker */
  colorSuggestions: string[];
  /** Change event handler */
  onChange: (settings: Pick<Theme, 'gridX' | 'gridY'>) => void;
};

const Grid: FC<Props> = ({ settings, colorSuggestions, onChange }) => {
  const { t } = useTranslation();
  const { modalContentRef } = useContext(ThemeModalContext);

  const onColorChange = (color: string) => {
    onChange({
      gridX: { ...settings.gridX, color },
      gridY: { ...settings.gridY, color },
    });
  };

  return (
    <Section>
      <SettingsHeadline title={t('theme_editor.widget_grid_title')} />
      <div>
        <SectionRow data-testid="grid-settings">
          <TextWrapper>
            <BodyText variant="body2" fontWeight="bold">
              {t('theme_editor.grid_color')}
            </BodyText>
          </TextWrapper>
          <Color
            scrollableContainerRef={modalContentRef}
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
