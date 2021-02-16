import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  useContext,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Dropdown, Portal } from '@keen.io/ui-core';

import { getEventPath } from '../../utils';

import { AppContext } from '../../contexts';

import { FilterItem, SearchTags } from './components';
import {
  Container,
  Filter,
  TagsContainer,
  DropdownContainer,
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
    const {
      left,
      bottom,
    }: ClientRect = containerRef.current.getBoundingClientRect();

    setDropdown((state) => ({
      ...state,
      x: left,
      y: bottom + window.scrollY,
    }));
  }, [isOpen]);

  useEffect(() => {
    document.addEventListener('click', outsideClick);
    return () => document.removeEventListener('click', outsideClick);
  }, [isOpen, containerRef]);

  const isEmptySearch = searchPhrase && !filteredTags.length;
  const filtersCount = tags.length + (showOnlyPublicDashboards ? 1 : 0);

  const { modalContainer } = useContext(AppContext);

  return (
    <>
      <Container ref={containerRef} onClick={() => setOpen(!isOpen)}>
        <Filter>
          {t('tags_filters.title')}
          {filtersCount ? ` (${filtersCount})` : null}
        </Filter>
      </Container>
      <Portal modalContainer={modalContainer}>
        <DropdownContainer ref={dropdownContainerRef}>
          <Dropdown
            isOpen={isOpen}
            fullWidth={false}
            positionRelativeToDocument={true}
            motion={{
              initial: { opacity: 0, top: dropdown.y, left: dropdown.x },
              animate: { opacity: 1, top: dropdown.y, left: dropdown.x },
              exit: { opacity: 0, top: dropdown.y, left: dropdown.x },
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
                  {t('tags_filters.empty_search_message')}
                </EmptySearch>
              )}
            </DropdownContent>
            <ClearFilters
              onClick={() => {
                dispatch(setTagsFiltersPublic(false));
                dispatch(setTagsFilters([]));
              }}
            >
              {t('tags_filters.clear')}
            </ClearFilters>
          </Dropdown>
        </DropdownContainer>
      </Portal>
    </>
  );
};

export default FilterDashboards;
