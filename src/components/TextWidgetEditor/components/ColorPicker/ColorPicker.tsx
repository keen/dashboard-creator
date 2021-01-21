import React, { FC, useState, useRef, useEffect, useCallback } from 'react';
import { Dropdown } from '@keen.io/ui-core';
import { colors } from '@keen.io/colors';

import OptionHeader from '../OptionHeader';
import {
  Container,
  ColorsContainer,
  ColorTone,
  DropdownContainer,
  Square,
} from './ColorPicker.styles';

type Props = {};

const ColorPicker: FC<Props> = () => {
  const [isOpen, setOpen] = useState(false);

  const containerRef = useRef(null);
  const outsideClick = useCallback(
    (e) => {
      if (
        isOpen &&
        containerRef.current &&
        !containerRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    },
    [isOpen, containerRef]
  );

  useEffect(() => {
    document.addEventListener('click', outsideClick);
    return () => document.removeEventListener('click', outsideClick);
  }, [isOpen, containerRef]);

  const colorNames = Object.keys(colors);

  return (
    <Container ref={containerRef}>
      <OptionHeader onClick={() => setOpen(true)}>header</OptionHeader>
      <DropdownContainer>
        <Dropdown isOpen={isOpen}>
          <ColorsContainer>
            {colorNames.map((name) => {
              const saturationLevels = Object.keys(colors[name]);
              const palette = saturationLevels.map((saturation) => (
                <Square
                  key={saturation}
                  style={{ background: colors[name][saturation] }}
                />
              ));

              return <ColorTone key={name}>{palette}</ColorTone>;
            })}
          </ColorsContainer>
        </Dropdown>
      </DropdownContainer>
    </Container>
  );
};

export default ColorPicker;
