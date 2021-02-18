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
import { Dropdown, Portal, TIME_PICKER_CLASS, Button } from '@keen.io/ui-core';

import {
  Container,
  Title,
  DropdownContainer,
  TitleContainer,
  ClearFilter,
} from './FilterWidget.styles';

import { getWidget } from '../../modules/widgets';

import { RootState } from '../../rootReducer';
import { AppContext } from '../../contexts';

import { getEventPath } from '../../utils';
import { useTranslation } from 'react-i18next';

type Props = {
  /** Widget identifier */
  id: string;
  /** Disable chart interactions */
  disableInteractions?: boolean;
};

const FilterWidget: FC<Props> = ({ id, disableInteractions }) => {
  const { t } = useTranslation();
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
            {/*<TagsContainer>*/}
            {/*  {filteredTags.map((tag) => (*/}
            {/*      <FilterItem*/}
            {/*          key={tag}*/}
            {/*          id={tag}*/}
            {/*          isActive={tags.includes(tag)}*/}
            {/*          label={tag}*/}
            {/*          onChange={(isActive) => updateTags(isActive, tag)}*/}
            {/*      />*/}
            {/*  ))}*/}
            {/*</TagsContainer>*/}
            {/*{isEmptySearch && (*/}
            {/*    <EmptySearch>*/}
            {/*      {t('tags_filters.empty_search_message')}*/}
            {/*    </EmptySearch>*/}
            {/*)}*/}
            {/*</DropdownContent>*/}
            <div>
              <Button onClick={() => console.log('click')} variant="secondary">
                Button
              </Button>
              <ClearFilter
              // onClick={() => {
              //   dispatch(setTagsFiltersPublic(false));
              //   dispatch(setTagsFilters([]));
              // }}
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
