import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  // useContext,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { transparentize } from 'polished';
import { Dropdown, Portal } from '@keen.io/ui-core';
import { BodyText } from '@keen.io/typography';
import { colors } from '@keen.io/colors';

import { getEventPath, getRelativeBoundingRect } from '../../utils';

// import { AppContext } from '../../contexts';

import { FilterItem, SearchTags } from './components';
import {
  Container,
  Filter,
  TagsContainer,
  DropdownContent,
  EmptySearch,
  ClearFilters,
} from './FilterDashboards.styles';

import {
  getTagsPool,
  prepareTagsPool,
  clearTagsPool,
  getTagsFilter,
  setTagsFilters,
  setTagsFiltersPublic,
} from '../../modules/dashboards';

const FilterDashboards = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const containerRef = useRef(null);
  const dropdownContainerRef = useRef(null);
  const [isOpen, setOpen] = useState(false);
  const [searchMode, setSearchMode] = useState(false);
  const [searchPhrase, setSearchPhrase] = useState('');
  const [dropdown, setDropdown] = useState({ x: 0, y: 0 });

  useEffect(() => {
    isOpen ? dispatch(prepareTagsPool()) : dispatch(clearTagsPool());
  }, [isOpen]);

  const tagsPool = useSelector(getTagsPool);
  const { showOnlyPublicDashboards, tags } = useSelector(getTagsFilter);

  const filteredTags = useMemo(() => {
    if (searchPhrase) {
      const phrase = searchPhrase.toLowerCase();
      return tagsPool.filter((tag) => tag.toLowerCase().includes(phrase));
    }
    return tagsPool;
  }, [searchPhrase, tagsPool]);

  const outsideClick = useCallback(
    (e) => {
      const path = getEventPath(e);
      if (
        !path?.includes(containerRef.current) &&
        !path?.includes(dropdownContainerRef.current)
      ) {
        setOpen(false);
        setSearchPhrase('');
        setSearchMode(false);
      }
    },
    [isOpen, containerRef, dropdownContainerRef]
  );

  const updateTags = useCallback(
    (isActive: boolean, tag: string) => {
      const updatedTags = isActive
        ? [...tags, tag]
        : tags.filter((t) => t !== tag);
      dispatch(setTagsFilters(updatedTags));
    },
    [tags, setTagsFilters]
  );

  useEffect(() => {
    // TODO: Get container via context API
    const element = document.getElementById('dropdown-container');

    const { left, bottom } = getRelativeBoundingRect(
      element,
      containerRef.current
    );

    setDropdown((state) => ({
      ...state,
      x: left,
      y: bottom,
    }));
  }, [isOpen]);

  useEffect(() => {
    document.addEventListener('click', outsideClick);
    return () => document.removeEventListener('click', outsideClick);
  }, [isOpen, containerRef]);

  const isEmptySearch = searchPhrase && !filteredTags.length;
  const filtersCount = tags.length + (showOnlyPublicDashboards ? 1 : 0);

  // const { modalContainer } = useContext(AppContext);

  return (
    <>
      <Container
        ref={containerRef}
        onClick={() => setOpen(!isOpen)}
        isOpen={isOpen}
      >
        <Filter>
          <BodyText variant="body2" fontWeight="bold">
            {t('tags_filters.title')}
            {filtersCount ? ` (${filtersCount})` : null}
          </BodyText>
        </Filter>
      </Container>
      <Portal modalContainer={'#dropdown-container'}>
        <div ref={dropdownContainerRef}>
          <Dropdown
            isOpen={isOpen}
            fullWidth={false}
            positionRelativeToDocument={true}
            motion={{
              initial: { opacity: 0, top: dropdown.y, left: dropdown.x, y: 20 },
              animate: { opacity: 1, y: 2 },
              exit: { opacity: 0, y: 30 },
            }}
          >
            <DropdownContent>
              <FilterItem
                id="public"
                label={t('tags_filters.show_only_public_dashboards')}
                isActive={showOnlyPublicDashboards}
                onChange={(e, isActive) => {
                  e.preventDefault();
                  dispatch(setTagsFiltersPublic(isActive));
                }}
              />
              <SearchTags
                isActive={searchMode}
                searchPhrase={searchPhrase}
                inputPlaceholder={t(
                  'tags_filters.search_tags_input_placeholder'
                )}
                searchLabel={t('tags_filters.search_label')}
                onChangePhrase={(phrase) => setSearchPhrase(phrase)}
                onClearPhrase={() => {
                  setSearchPhrase('');
                  setSearchMode(false);
                }}
                onActiveSearch={() => setSearchMode(true)}
              />
              <TagsContainer>
                {filteredTags.map((tag) => (
                  <FilterItem
                    key={tag}
                    id={tag}
                    isActive={tags.includes(tag)}
                    label={tag}
                    onChange={(e, isActive) => {
                      e.preventDefault();
                      updateTags(isActive, tag);
                    }}
                  />
                ))}
              </TagsContainer>
              {isEmptySearch && (
                <EmptySearch>
                  <BodyText
                    variant="body3"
                    fontWeight="normal"
                    color={transparentize(0.2, colors.black[100])}
                  >
                    {t('tags_filters.empty_search_message')}
                  </BodyText>
                </EmptySearch>
              )}
            </DropdownContent>
            <ClearFilters
              onClick={() => {
                dispatch(setTagsFiltersPublic(false));
                dispatch(setTagsFilters([]));
              }}
            >
              <BodyText
                variant="body2"
                fontWeight="bold"
                color={colors.blue[200]}
              >
                {t('tags_filters.clear')}
              </BodyText>
            </ClearFilters>
          </Dropdown>
        </div>
      </Portal>
    </>
  );
};

export default FilterDashboards;
