import React, { FC, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { ColorPalette, DropableContainer, Dropdown } from '@keen.io/ui-core';
import { BodyText } from '@keen.io/typography';
import { colors as keenColors } from '@keen.io/colors';

import SettingsHeadline from '../SettingsHeadline';
import Section from '../Section';
import {
  Heading,
  Palette,
  Divider,
  SelectColorPalette,
  ColorsList,
  ColorItem,
  ColorRectangle,
  ColorPaletteWrapper,
} from './ColorManager.styles';

import { createColorPalettes } from './utils';
import { getColorSuggestions } from '../../utils';
import { COLORS_IN_LIST } from './constants';
import { themeSelectors } from '../../../../modules/theme';
import { ThemeModalContext } from '../../../ThemeEditorModal/ThemeEditorModal';

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
  onSelectPalette: (name: string, colors: string[]) => void;
};

const ColorManager: FC<Props> = ({
  colorPaletteName,
  colors,
  defaultColors,
  onSelectPalette,
  onUpdateColors,
}) => {
  const { t } = useTranslation();
  const [isOpen, setOpen] = useState(false);

  const currentEditTheme = useSelector(themeSelectors.getCurrentEditTheme);
  const colorSuggestions = getColorSuggestions(colors, currentEditTheme);
  const { modalContentRef } = useContext(ThemeModalContext);
  return (
    <Section>
      <Heading>
        <SettingsHeadline
          title={t('theme_editor.color_palette_title')}
          description={t('theme_editor.color_palette_description')}
        />
      </Heading>
      <div>
        <SelectColorPalette>
          <DropableContainer
            isActive={isOpen}
            onClick={() => !isOpen && setOpen(true)}
            onDefocus={() => setOpen(false)}
            dropIndicator
            variant="secondary"
            value={colorPaletteName}
          >
            {colorPaletteName}
          </DropableContainer>
        </SelectColorPalette>
        <Dropdown isOpen={isOpen} fullWidth={false}>
          <ColorsList>
            {createColorPalettes(defaultColors).map(
              ({ name, colors }, idx, arr) => (
                <React.Fragment key={name}>
                  <ColorItem onClick={() => onSelectPalette(name, colors)}>
                    <BodyText variant="body2" color={keenColors.blue[500]}>
                      {name}
                    </BodyText>
                    <Palette>
                      {colors.slice(0, COLORS_IN_LIST).map((color) => (
                        <ColorRectangle
                          key={color}
                          style={{ background: color }}
                        />
                      ))}
                    </Palette>
                  </ColorItem>
                  {idx !== arr.length - 1 && <Divider />}
                </React.Fragment>
              )
            )}
          </ColorsList>
        </Dropdown>
        <ColorPaletteWrapper>
          <ColorPalette
            colors={colors}
            colorSuggestions={colorSuggestions}
            onColorsChange={(colors) => onUpdateColors(colors)}
            scrollableParentRef={modalContentRef}
          />
        </ColorPaletteWrapper>
      </div>
    </Section>
  );
};

export default ColorManager;
