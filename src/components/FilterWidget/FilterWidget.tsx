import React, { FC, useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { transparentize } from 'polished';
import { Icon } from '@keen.io/icons';
import { colors } from '@keen.io/colors';
import { Dropdown, Portal, Loader, Button, Title } from '@keen.io/ui-core';
import { FixedSizeList as ReactWindowList } from 'react-window';

import {
  Container,
  DropdownContainer,
  TitleContainer,
  FilterButtonSecondary,
  DropdownContent,
  LoaderContainer,
  DropdownFooter,
  EmptySearch,
  SelectedPropertiesNumber,
  DropdownHeader,
  IconWrapper,
  TitleWrapper,
} from './FilterWidget.styles';

import { getWidget } from '../../modules/widgets';
import { RootState } from '../../rootReducer';
import { getEventPath, getRelativeBoundingRect } from '../../utils';
import {
  applyFilterModifiers,
  applyFilterWidget,
  setFilterWidget,
  unapplyFilterWidget,
} from '../../modules/widgets/actions';
import { FilterItem, SearchTags } from '../FilterDashboards/components';
import { FilterWidget } from '../../modules/widgets';
import { DROPDOWN_CONTAINER_ID } from '../../constants';

type Props = {
  /** Widget identifier */
  id: string;
  /** Disable chart interactions */
  disableInteractions?: boolean;
};

const Row = ({ data, index, style }) => {
  const { items, activeProperties, updateActiveProperties } = data;
  return (
    <div style={style} role="filter-item">
      <FilterItem
        key={items[index]}
        id={items[index]}
        isActive={activeProperties.includes(items[index])}
        label={items[index]}
        onChange={(e, isActive: boolean) => {
          e.preventDefault();
          updateActiveProperties(isActive, items[index]);
        }}
      />
    </div>
  );
};

const FilterWidget: FC<Props> = ({ id, disableInteractions }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const widget = useSelector((state: RootState) => getWidget(state, id));
  const MIN_DROPDOWN_WIDTH = 220;
  const filterWidget = widget.widget as FilterWidget;
  const [isOpen, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState({ x: 0, y: 0, width: 0 });
  const [searchMode, setSearchMode] = useState(false);
  const [searchPhrase, setSearchPhrase] = useState('');
  const [activeProperties, setActiveProperties] = useState([]);

  const containerRef = useRef(null);
  const dropdownContainerRef = useRef(null);

  const getDropdownXPositionThatFitsViewport = (left, right, dropdownWidth) => {
    if (window && window.innerWidth < left + dropdownWidth) {
      return right - dropdownWidth;
    }
    return left;
  };

  useEffect(() => {
    const outsideClick = (e) => {
      const path = getEventPath(e);
      if (
        !path?.includes(containerRef.current) &&
        !path?.includes(dropdownContainerRef.current)
      ) {
        setOpen(false);
      }
    };

    if (isOpen && containerRef.current) {
      const {
        left,
        bottom,
        right,
        width: parentWidth,
      } = getRelativeBoundingRect(DROPDOWN_CONTAINER_ID, containerRef.current);

      const dropdownWidth =
        parentWidth > MIN_DROPDOWN_WIDTH ? parentWidth : MIN_DROPDOWN_WIDTH;

      setDropdown((state) => ({
        ...state,
        x: getDropdownXPositionThatFitsViewport(
          left,
          right,
          MIN_DROPDOWN_WIDTH
        ),
        y: bottom,
        width: dropdownWidth,
      }));
    }

    document.addEventListener('click', outsideClick);
    return () => {
      document.removeEventListener('click', outsideClick);
    };
  }, [isOpen, containerRef]);

  useEffect(() => {
    if (isOpen && !widget.data) {
      dispatch(setFilterWidget(widget.widget.id));
    }
    if (widget.data && widget.data.filter) {
      setActiveProperties(widget.data.filter.propertyValue);
    }
    if (!widget.data || !widget.data.filter) {
      setActiveProperties([]);
    }
  }, [isOpen]);

  const toggleSelectAll = () => {
    if (activeProperties.length === widget.data.propertyList.length) {
      return setActiveProperties([]);
    }
    return setActiveProperties(widget.data.propertyList);
  };

  const availableProperties = () => {
    if (widget.data && widget.data.propertyList) {
      return widget.data.propertyList.filter((property) =>
        property.toLowerCase().startsWith(searchPhrase.toLocaleLowerCase())
      );
    }
    return [];
  };

  const updateActiveProperties = (isActive, property) => {
    let properties = [...activeProperties];
    if (isActive) {
      properties.push(property);
    } else {
      properties = properties.filter((prop) => prop !== property);
    }
    setActiveProperties(properties);
  };

  const applyFilter = () => {
    if (activeProperties.length === 0) {
      dispatch(unapplyFilterWidget(widget.widget.id));
    } else {
      dispatch(applyFilterWidget(widget.widget.id, activeProperties));
      dispatch(applyFilterModifiers(widget.widget.id));
    }
    setOpen(false);
  };

  const filterItemData = {
    items: availableProperties(),
    activeProperties: activeProperties,
    updateActiveProperties,
  };

  return (
    <>
      <Container
        ref={containerRef}
        isOpen={isOpen}
        data-testid="filter-widget"
        onClick={() => {
          if (!disableInteractions) {
            setOpen(!isOpen);
          }
        }}
      >
        {
          <TitleContainer>
            <IconWrapper>
              <Icon
                type="funnel-widget-vertical"
                fill={transparentize(0.6, colors.blue[500])}
                width={13}
                height={13}
              />
            </IconWrapper>
            <TitleWrapper role="heading">
              <Title variant="body-bold">
                {filterWidget.settings.name}
                {widget.isActive && (
                  <SelectedPropertiesNumber data-testid="applied-properties-number">
                    {widget.data.filter.propertyValue.length}
                  </SelectedPropertiesNumber>
                )}
              </Title>
            </TitleWrapper>
          </TitleContainer>
        }
      </Container>
      <Portal modalContainer={`#${DROPDOWN_CONTAINER_ID}`}>
        <DropdownContainer
          ref={dropdownContainerRef}
          customTransform={`translate(${dropdown.x}px, ${dropdown.y}px)`}
          width={dropdown.width}
        >
          <Dropdown isOpen={isOpen}>
            {(widget.isLoading ||
              (widget.data && widget.data.propertyList)) && (
              <DropdownHeader>
                <FilterButtonSecondary onClick={toggleSelectAll}>
                  {widget.data &&
                  widget.data.propertyList &&
                  widget.data.propertyList.length === activeProperties.length
                    ? t('filter_widget.unselect_all')
                    : t('filter_widget.select_all')}
                </FilterButtonSecondary>
              </DropdownHeader>
            )}

            <DropdownContent>
              {(widget.isLoading ||
                (widget.data && widget.data.propertyList)) && (
                <SearchTags
                  isActive={searchMode}
                  searchPhrase={searchPhrase}
                  inputPlaceholder={t('filter_widget.search_value')}
                  searchLabel={t('filter_widget.search_value')}
                  onChangePhrase={(phrase) => setSearchPhrase(phrase)}
                  onClearPhrase={() => {
                    setSearchPhrase('');
                    setSearchMode(false);
                  }}
                  onActiveSearch={() => setSearchMode(true)}
                />
              )}
              {widget.isLoading ? (
                <LoaderContainer>
                  <Loader width={50} height={50} fill={colors.blue['500']} />
                </LoaderContainer>
              ) : availableProperties().length ? (
                <ReactWindowList
                  height={150}
                  data-testid="scroll-wrapper2"
                  itemData={filterItemData}
                  itemCount={filterItemData.items.length}
                  itemSize={30}
                >
                  {Row}
                </ReactWindowList>
              ) : null}
              {!widget.isLoading && availableProperties().length === 0 && (
                <EmptySearch>
                  {t('filter_widget.no_properties_found')}
                </EmptySearch>
              )}
            </DropdownContent>
            {(widget.isLoading ||
              (widget.data && widget.data.propertyList)) && (
              <DropdownFooter>
                <Button size="small" onClick={applyFilter} variant="secondary">
                  {t('filter_widget.apply')}
                </Button>
                <FilterButtonSecondary
                  onClick={() => {
                    dispatch(unapplyFilterWidget(widget.widget.id));
                    setOpen(false);
                  }}
                >
                  {t('filter_widget.clear')}
                </FilterButtonSecondary>
              </DropdownFooter>
            )}
          </Dropdown>
        </DropdownContainer>
      </Portal>
    </>
  );
};

export default FilterWidget;
