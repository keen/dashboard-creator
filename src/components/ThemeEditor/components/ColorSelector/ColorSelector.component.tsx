import React, { FC, useRef, useState } from 'react';
import { ColorPicker, Dropdown } from '@keen.io/ui-core';
import { useOnClickOutside } from '@keen.io/react-hooks';
import { Color, DropdownWrapper, ColorWrapper } from './ColorSelector.styles';

type Props = {
  color: string;
  colorSuggestions: string[];
  onColorChange: (color) => void;
};

const ColorSelector: FC<Props> = ({
  color: initialColor,
  onColorChange,
  colorSuggestions,
}) => {
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const [color, setColor] = useState(initialColor);
  const dropdownRef = useRef(null);

  const onClickOutsideColorPicker = () => {
    setColorPickerVisible(false);
  };

  useOnClickOutside(dropdownRef, onClickOutsideColorPicker);

  const changeColor = (color: string) => {
    setColor(color);
    onColorChange(color);
    setColorPickerVisible(false);
  };

  return (
    <ColorWrapper ref={dropdownRef}>
      <Color
        background={color}
        onClick={() => setColorPickerVisible(true)}
      ></Color>
      <DropdownWrapper>
        <Dropdown isOpen={colorPickerVisible}>
          <ColorPicker
            color={color}
            colorSuggestions={colorSuggestions}
            onColorChange={(color) => changeColor(color)}
            onClosePicker={() => setColorPickerVisible(false)}
          />
        </Dropdown>
      </DropdownWrapper>
    </ColorWrapper>
  );
};

export default ColorSelector;
