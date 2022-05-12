import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Filters } from '@keen.io/ui-core';
import { BodyText } from '@keen.io/typography';

import { Container, Filter } from './FilterDashboards.styles';
import {
  dashboardsActions,
  dashboardsSelectors,
} from '../../modules/dashboards';

const FilterDashboards = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    isOpen
      ? dispatch(dashboardsActions.prepareTagsPool())
      : dispatch(dashboardsActions.clearTagsPool());
  }, [isOpen]);

  const tagsPool = useSelector(dashboardsSelectors.getTagsPool);
  const onlyPublicDashboardsTag = t('tags_filters.show_only_public_dashboards');
  const specialTagsPool = [onlyPublicDashboardsTag];
  const { showOnlyPublicDashboards, tags } = useSelector(
    dashboardsSelectors.getTagsFilter
  );

  const onUpdateTags = (filters: string[]) => {
    const selectedTags = filters.filter(
      (filter) => !specialTagsPool.includes(filter)
    );
    dispatch(dashboardsActions.setTagsFilters({ tags: selectedTags }));
    if (filters.includes(onlyPublicDashboardsTag)) {
      return dispatch(dashboardsActions.setTagsFiltersPublic(true));
    }
    dispatch(dashboardsActions.setTagsFiltersPublic(false));
  };

  const onClearTags = () => {
    dispatch(dashboardsActions.setTagsFilters({ tags: [] }));
    dispatch(dashboardsActions.setTagsFiltersPublic(false));
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
