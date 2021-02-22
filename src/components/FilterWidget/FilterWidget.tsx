import React, {
  FC,
  useRef,
  useState,
  useCallback,
  useEffect,
  useContext,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { transparentize } from 'polished';
import { Icon } from '@keen.io/icons';
import { colors } from '@keen.io/colors';
import { Dropdown, Portal, Loader, Button } from '@keen.io/ui-core';

import {
  Container,
  Title,
  DropdownContainer,
  TitleContainer,
  FilterButtonSecondary,
  DropdownContent,
  LoaderContainer,
  ScrollWrapper,
  DropdownFooter,
  EmptySearch,
  SelectedPropertiesNumber,
  DropdownHeader,
} from './FilterWidget.styles';

import { getWidget } from '../../modules/widgets';
import { RootState } from '../../rootReducer';
import { AppContext } from '../../contexts';
import { getEventPath } from '../../utils';
import {
  applyFilterModifiers,
  applyFilterWidget,
  setFilterWidget,
  unapplyFilterWidget,
} from '../../modules/widgets/actions';
import { FilterItem, SearchTags } from '../FilterDashboards/components';
import { FilterWidget } from '../../modules/widgets/types';

type Props = {
  /** Widget identifier */
  id: string;
  /** Disable chart interactions */
  disableInteractions?: boolean;
};

const FilterWidget: FC<Props> = ({ id, disableInteractions }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { modalContainer } = useContext(AppContext);

  const widget = useSelector((state: RootState) => getWidget(state, id));
  const filterWidget = widget.widget as FilterWidget;
  const [isOpen, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState({ x: 0, y: 0, width: 0 });
  const [searchMode, setSearchMode] = useState(false);
  const [searchPhrase, setSearchPhrase] = useState('');
  const [activeProperties, setActiveProperties] = useState([]);

  let targetProperty = null;

  if (filterWidget.settings && filterWidget.settings.targetProperty) {
    const properties = filterWidget.settings.targetProperty.split('.');
    targetProperty = properties[properties.length - 1];
  }

  const containerRef = useRef(null);
  const dropdownContainerRef = useRef(null);

  const outsideClick = useCallback(
    (e) => {
      const path = getEventPath(e);
      if (
        !path?.includes(containerRef.current) &&
        !path?.includes(dropdownContainerRef.current)
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
    if (widget.data) {
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
    dispatch(applyFilterWidget(widget.widget.id, activeProperties));
    dispatch(applyFilterModifiers(widget.widget.id));
    setOpen(false);
  };

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
        {
          <TitleContainer>
            <Icon
              type="funnel-widget-vertical"
              fill={transparentize(0.5, colors.black[100])}
              width={15}
              height={15}
            />
            <Title role="heading">
              {targetProperty}{' '}
              {widget.isActive && (
                <SelectedPropertiesNumber>
                  {widget.data.filter.propertyValue.length}
                </SelectedPropertiesNumber>
              )}
            </Title>
          </TitleContainer>
        }
      </Container>
      <Portal modalContainer={modalContainer}>
        <DropdownContainer
          ref={dropdownContainerRef}
          customTransform={`translate(${dropdown.x}px, ${dropdown.y}px)`}
          width={dropdown.width}
        >
          <Dropdown isOpen={isOpen}>
            <DropdownHeader>
              <FilterButtonSecondary onClick={toggleSelectAll}>
                {widget.data &&
                widget.data.propertyList.length === activeProperties.length
                  ? t('filter_widget.unselect_all')
                  : t('filter_widget.select_all')}
              </FilterButtonSecondary>
            </DropdownHeader>
            {widget.isLoading ? (
              <LoaderContainer>
                <Loader width={50} height={50} fill={colors.blue['500']} />
              </LoaderContainer>
            ) : (
              <DropdownContent>
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
                <ScrollWrapper>
                  {availableProperties().map((property) => (
                    <FilterItem
                      key={property}
                      id={property}
                      isActive={activeProperties.includes(property)}
                      label={property}
                      onChange={(isActive) =>
                        updateActiveProperties(isActive, property)
                      }
                    />
                  ))}
                </ScrollWrapper>
                {!widget.isLoading && availableProperties().length === 0 && (
                  <EmptySearch>
                    {t('filter_widget.no_properties_found')}
                  </EmptySearch>
                )}
              </DropdownContent>
            )}
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
          </Dropdown>
        </DropdownContainer>
      </Portal>
    </>
  );
};

export default FilterWidget;
