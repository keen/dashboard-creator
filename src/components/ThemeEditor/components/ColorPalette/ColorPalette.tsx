import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Container } from './ColorPalette.styles';
import SettingsHeadline from '../SettingsHeadline';

type Props = {
  /** Current color palette name */
  colorPaletteName: string;
  /** Current set of colors in palette */
  colors: string[];
  /** Colors from default palette */
  defaultColors: string[];
  /** Update colors in palette handler */
  onUpdateColors: (colors: string[]) => void;
  /** Update color palette by select pre-defined colors */
  onUpdatePalette: (name: string, colors: string[]) => void;
};

const ColorPalette: FC<Props> = ({
  colorPaletteName,
  colors,
  defaultColors,
  onUpdatePalette,
}) => {
  const { t } = useTranslation();

  return (
    <Container>
      <SettingsHeadline
        title={t('theme_editor.color_palette_title')}
        description={t('theme_editor.color_palette_description')}
      />
      <div>
        {colorPaletteName}

        <div onClick={() => onUpdatePalette('default', defaultColors)}>
          Default
        </div>
        <div
          onClick={() =>
            onUpdatePalette('dracula', [
              '#50fa7b',
              '#ffb86c',
              '#6272a4',
              '#bd93f9',
              '#ff5555',
              '#f1fa8c',
            ])
          }
        >
          Dracula
        </div>
        <div style={{ display: 'flex' }}>
          {colors.map((color, idx) => (
            <div
              key={`${color}-${idx}`}
              style={{ background: color, width: 20, height: 20 }}
            />
          ))}
        </div>
      </div>
    </Container>
  );
};

export default ColorPalette;
