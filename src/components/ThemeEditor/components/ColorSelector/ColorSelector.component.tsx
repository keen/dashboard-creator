import React, { FC, useContext, useEffect, useRef, useState } from 'react';
import { Color, DropdownWrapper, ColorWrapper } from './ColorSelector.styles';
import { ColorPicker, Dropdown, DynamicPortal } from '@keen.io/ui-core';
import { useOnClickOutside } from '@keen.io/react-hooks';
import { ThemeModalContext } from '../../../ThemeEditorModal/ThemeEditorModal';

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
  const [colorPickerPosition, setColorPickerPosition] = useState({
    x: 0,
    y: 0,
  });
  const [modalScrollY, setModalScrollY] = useState(0);
  const dropdownRef = useRef(null);
  const pickerRef = useRef(null);
  const { modalContentRef } = useContext(ThemeModalContext);

  const onClickOutsideColorPicker = () => {
    if (colorPickerVisible) {
      setColorPickerVisible(false);
    }
  };

  useOnClickOutside(pickerRef, onClickOutsideColorPicker);

  const changeColor = (color: string) => {
    setColor(color);
    onColorChange(color);
    setColorPickerVisible(false);
  };

  const setPickerPosition = () => {
    const dropdownRect = dropdownRef.current.getBoundingClientRect();
    setColorPickerPosition({
      x: dropdownRect.x,
      y: dropdownRect.y + window.scrollY + dropdownRect.height + modalScrollY,
    });
  };

  const hidePicker = () => {
    setColorPickerVisible(false);
  };

  useEffect(() => {
    modalContentRef?.current?.addEventListener('scroll', hidePicker);
    return () => {
      modalContentRef?.current?.removeEventListener('scroll', hidePicker);
    };
  }, [modalContentRef]);

  return (
    <ColorWrapper
      ref={dropdownRef}
      onMouseEnter={() => {
        setModalScrollY(0);
        setPickerPosition();
      }}
    >
      <Color
        background={color}
        onClick={() => {
          setPickerPosition();
          setColorPickerVisible(true);
        }}
      ></Color>
      <DynamicPortal>
        <DropdownWrapper
          x={colorPickerPosition.x}
          y={colorPickerPosition.y}
          ref={pickerRef}
        >
          <Dropdown isOpen={colorPickerVisible}>
            <ColorPicker
              color={color}
              colorSuggestions={colorSuggestions}
              onColorChange={(color) => changeColor(color)}
              onClosePicker={() => setColorPickerVisible(false)}
            />
          </Dropdown>
        </DropdownWrapper>
      </DynamicPortal>
    </ColorWrapper>
  );
};

export default ColorSelector;
