import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Filters } from '@keen.io/ui-core';
import { BodyText } from '@keen.io/typography';

import {
  getTagsPool,
  prepareTagsPool,
  clearTagsPool,
  getTagsFilter,
  setTagsFilters,
  setTagsFiltersPublic,
} from '../../modules/dashboards';

import { Container, Filter } from './FilterDashboards.styles';

const FilterDashboards = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    isOpen ? dispatch(prepareTagsPool()) : dispatch(clearTagsPool());
  }, [isOpen]);

  const tagsPool = useSelector(getTagsPool);
  const onlyPublicDashboardsTag = t('tags_filters.show_only_public_dashboards');
  const specialTagsPool = [onlyPublicDashboardsTag];
  const { showOnlyPublicDashboards, tags } = useSelector(getTagsFilter);

  const onUpdateTags = (filters: string[]) => {
    const selectedTags = filters.filter(
      (filter) => !specialTagsPool.includes(filter)
    );
    dispatch(setTagsFilters(selectedTags));
    if (filters.includes(onlyPublicDashboardsTag)) {
      return dispatch(setTagsFiltersPublic(true));
    }
    dispatch(setTagsFiltersPublic(false));
  };

  const onClearTags = () => {
    dispatch(setTagsFilters([]));
    dispatch(setTagsFiltersPublic(false));
  };

  const activeFilters = useMemo(() => {
    return [
      ...tags,
      ...(showOnlyPublicDashboards ? [onlyPublicDashboardsTag] : []),
    ];
  }, [showOnlyPublicDashboards, tags]);

  const labels = {
    searchLabel: t('tags_filters.search_label'),
    searchInputPlaceholder: t('tags_filters.search_tags_input_placeholder'),
    clearFilters: t('tags_filters.clear'),
    noFiltersFound: t('tags_filters.empty_search_message'),
  };

  return (
    <>
      <Filters
        filters={tagsPool}
        specialFilters={specialTagsPool}
        activeFilters={activeFilters}
        onUpdateFilters={(filters) => onUpdateTags(filters)}
        onClearFilters={onClearTags}
        isOpen={isOpen}
        setOpen={(isOpen) => setOpen(isOpen)}
        labels={labels}
      >
        <Container onClick={() => setOpen(!isOpen)} isOpen={isOpen}>
          <Filter>
            <BodyText variant="body2" fontWeight="bold">
              {t('tags_filters.title')}
              {activeFilters && activeFilters.length
                ? ` (${activeFilters.length})`
                : null}
            </BodyText>
          </Filter>
        </Container>
      </Filters>
    </>
  );
};

export default FilterDashboards;
