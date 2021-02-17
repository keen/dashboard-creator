import React, {
  FC,
  useRef,
  useState,
  useCallback,
  useEffect,
  useContext,
} from 'react';
// import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { transparentize } from 'polished';
import { Icon } from '@keen.io/icons';
import { colors } from '@keen.io/colors';
import { Dropdown, Portal, TIME_PICKER_CLASS } from '@keen.io/ui-core';

import {
  Container,
  Title,
  DropdownContainer,
  TitleContainer,
} from './FilterWidget.styles';

import { getWidget } from '../../modules/widgets';

import { RootState } from '../../rootReducer';
import { AppContext } from '../../contexts';

import { getEventPath } from '../../utils';

type Props = {
  /** Widget identifier */
  id: string;
  /** Disable chart interactions */
  disableInteractions?: boolean;
};

const FilterWidget: FC<Props> = ({ id, disableInteractions }) => {
  // const { t } = useTranslation();
  const { modalContainer } = useContext(AppContext);

  const widget = useSelector((state: RootState) => getWidget(state, id));

  const [isOpen, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState({ x: 0, y: 0, width: 0 });

  const containerRef = useRef(null);
  const dropdownContainerRef = useRef(null);

  const outsideClick = useCallback(
    (e) => {
      const path = getEventPath(e);
      if (
        !path?.includes(containerRef.current) &&
        !path?.includes(dropdownContainerRef.current) &&
        !path?.includes(document.querySelector(`.${TIME_PICKER_CLASS}`))
      ) {
        setOpen(false);
      }
    },
    [isOpen, containerRef, dropdownContainerRef]
  );

  useEffect(() => {
    if (isOpen && containerRef.current) {
      const {
        left,
        bottom,
        width,
      }: ClientRect = containerRef.current.getBoundingClientRect();

      setDropdown((state) => ({
        ...state,
        x: left,
        y: bottom - document.body.offsetHeight + window.scrollY,
        width,
      }));
    }

    document.addEventListener('click', outsideClick);
    return () => document.removeEventListener('click', outsideClick);
  }, [isOpen, containerRef]);

  return (
    <>
      <Container
        ref={containerRef}
        isOpen={isOpen}
        onClick={() => {
          if (!disableInteractions) {
            setOpen(!isOpen);
          }
        }}
      >
        {widget.isActive ? (
          <TitleContainer>
            <Icon
              type="date-picker"
              fill={transparentize(0.5, colors.black[100])}
              width={15}
              height={15}
            />
            <Title role="heading">FILTER WIDGET</Title>
          </TitleContainer>
        ) : (
          <TitleContainer>
            <Title role="heading">FILTER</Title>
          </TitleContainer>
        )}
      </Container>
      <Portal modalContainer={modalContainer}>
        <DropdownContainer
          ref={dropdownContainerRef}
          customTransform={`translate(${dropdown.x}px, ${dropdown.y}px)`}
          width={dropdown.width}
        >
          <Dropdown isOpen={isOpen}>Lorem ipsum</Dropdown>
        </DropdownContainer>
      </Portal>
    </>
  );
};

export default FilterWidget;
