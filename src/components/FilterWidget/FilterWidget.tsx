import React, {
  FC,
  useRef,
  useState,
  useCallback,
  useEffect,
  useContext,
} from 'react';
// import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { transparentize } from 'polished';
import { Icon } from '@keen.io/icons';
import { colors } from '@keen.io/colors';
import { Dropdown, Portal, TIME_PICKER_CLASS, Button } from '@keen.io/ui-core';

import {
  Container,
  Title,
  DropdownContainer,
  TitleContainer,
  ClearFilter,
  DropdownContent,
} from './FilterWidget.styles';

import { getWidget } from '../../modules/widgets';

import { RootState } from '../../rootReducer';
import { AppContext } from '../../contexts';

import { getEventPath } from '../../utils';
import { useTranslation } from 'react-i18next';
import {
  applyFilterWidget,
  setFilterWidget,
  unapplyFilterWidget,
} from '../../modules/widgets/actions';
import { FilterItem } from '../FilterDashboards/components';
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
  const [activeProperties, setActiveProperties] = useState([]);

  const updateActiveProperties = (isActive, property) => {
    let properties = [...activeProperties];
    if (isActive) {
      properties.push(property);
    } else {
      properties = properties.filter((prop) => prop !== property);
    }
    setActiveProperties(properties);
  };

  useEffect(() => {
    if (widget.data && widget.data.filter) {
      setActiveProperties(widget.data.filter.propertyValue);
    } else {
      setActiveProperties([]);
    }
  }, [widget]);

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

  useEffect(() => {
    if (isOpen) {
      dispatch(setFilterWidget(widget.widget.id));
      // console.log(widget)
    }
  }, [isOpen]);

  const applyFilter = () => {
    dispatch(applyFilterWidget(widget.widget.id, activeProperties));
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
        {widget.isActive ? (
          <TitleContainer>
            <Icon
              type="funnel-widget-vertical"
              fill={transparentize(0.5, colors.black[100])}
              width={15}
              height={15}
            />
            <Title role="heading">
              {filterWidget.settings.eventStream}{' '}
              {widget.data.filter.propertyValue.length}
            </Title>
          </TitleContainer>
        ) : (
          <TitleContainer>
            <Icon
              type="funnel-widget-vertical"
              fill={transparentize(0.5, colors.black[100])}
              width={15}
              height={15}
            />
            <Title role="heading">
              {filterWidget.settings
                ? filterWidget.settings.eventStream
                : 'Filter'}
            </Title>
          </TitleContainer>
        )}
      </Container>
      <Portal modalContainer={modalContainer}>
        <DropdownContainer
          ref={dropdownContainerRef}
          customTransform={`translate(${dropdown.x}px, ${dropdown.y}px)`}
          width={dropdown.width}
        >
          <Dropdown isOpen={isOpen}>
            {/*<DropdownContent>*/}
            {/*<FilterItem*/}
            {/*    id="cached"*/}
            {/*    label={t('tags_filters.show_only_public_dashboards')}*/}
            {/*    isActive={showOnlyPublicDashboards}*/}
            {/*    onChange={(isActive) =>*/}
            {/*        dispatch(setTagsFiltersPublic(isActive))*/}
            {/*    }*/}
            {/*/>*/}
            {/*<SearchTags*/}
            {/*    isActive={searchMode}*/}
            {/*    searchPhrase={searchPhrase}*/}
            {/*    inputPlaceholder={t(*/}
            {/*        'tags_filters.search_tags_input_placeholder'*/}
            {/*    )}*/}
            {/*    searchLabel={t('tags_filters.search_label')}*/}
            {/*    onChangePhrase={(phrase) => setSearchPhrase(phrase)}*/}
            {/*    onClearPhrase={() => {*/}
            {/*      setSearchPhrase('');*/}
            {/*      setSearchMode(false);*/}
            {/*    }}*/}
            {/*    onActiveSearch={() => setSearchMode(true)}*/}
            {/*/>*/}

            {/*<LoaderContainer>*/}
            {/*  <Loader width={50} height={50} fill={colors.blue['500']} />*/}
            {/*</LoaderContainer>*/}

            <DropdownContent>
              {widget.data &&
                widget.data.propertyList.map((property) => (
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
            </DropdownContent>

            {/*todo clear filter*/}
            {/*{isEmptySearch && (*/}
            {/*    <EmptySearch>*/}
            {/*      {t('tags_filters.empty_search_message')}*/}
            {/*    </EmptySearch>*/}
            {/*)}*/}
            {/*</DropdownContent>*/}
            <div>
              <Button onClick={applyFilter} variant="secondary">
                Apply filters
              </Button>
              <ClearFilter
                onClick={() => {
                  dispatch(unapplyFilterWidget(widget.widget.id));
                  setOpen(false);
                }}
              >
                {t('filter.clear')}
              </ClearFilter>
            </div>
          </Dropdown>
        </DropdownContainer>
      </Portal>
    </>
  );
};

export default FilterWidget;
