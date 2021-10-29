import React, { FC, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Filters } from '@keen.io/ui-core';
import { BodyText } from '@keen.io/typography';
import { Container, Filter } from './FilterQueries.styles';

type Props = {
  /** Tags available */
  tagsPool: string[];
  /** Active tags filters */
  tagsFilters: string[];
  /** Cache queries filters indicator */
  showOnlyCachedQueries: boolean;
  /** Update cache filter event handler */
  onUpdateCacheFilter: (isActive: boolean) => void;
  /** Update tags filters event handler */
  onUpdateTagsFilters: (tags: string[]) => void;
  /** Clear filters event handler */
  onClearFilters: () => void;
};

const FilterQueries: FC<Props> = ({
  tagsPool,
  tagsFilters,
  showOnlyCachedQueries,
  onUpdateCacheFilter,
  onUpdateTagsFilters,
  onClearFilters,
}) => {
  const { t } = useTranslation();
  const containerRef = useRef(null);
  const [isOpen, setOpen] = useState(false);

  const onlyCachedQueriesTag = t(
    'query_picker.filters.show_only_cached_queries'
  );
  const specialTagsPool = [onlyCachedQueriesTag];

  const onUpdateTags = (filters: string[]) => {
    const selectedTags = filters.filter(
      (filter) => !specialTagsPool.includes(filter)
    );
    onUpdateTagsFilters(selectedTags);
    if (filters.includes(onlyCachedQueriesTag)) {
      return onUpdateCacheFilter(true);
    }
    onUpdateCacheFilter(false);
  };

  const onClearTags = () => {
    onUpdateTagsFilters([]);
    onUpdateCacheFilter(false);
    onClearFilters();
  };

  const activeFilters = useMemo(() => {
    return [
      ...tagsFilters,
      ...(showOnlyCachedQueries ? [onlyCachedQueriesTag] : []),
    ];
  }, [onlyCachedQueriesTag, tagsFilters]);

  const labels = {
    searchLabel: t('query_picker.filters.search_label'),
    searchInputPlaceholder: t(
      'query_picker.filters.search_tags_input_placeholder'
    ),
    clearFilters: t('query_picker.filters.clear'),
    noFiltersFound: t('query_picker.filters.empty_search_message'),
  };

  return (
    <Container ref={containerRef} data-testid="filter-queries">
      <Filters
        filters={tagsPool}
        activeFilters={activeFilters}
        specialFilters={specialTagsPool}
        onUpdateFilters={(filters) => onUpdateTags(filters)}
        onClearFilters={onClearTags}
        isOpen={isOpen}
        setOpen={setOpen}
        labels={labels}
      >
        <Filter onClick={() => setOpen(!isOpen)}>
          <BodyText variant="body2" fontWeight="bold">
            {t('query_picker.filters.title')}
            {activeFilters && activeFilters.length
              ? ` (${activeFilters.length})`
              : null}
          </BodyText>
        </Filter>
      </Filters>
    </Container>
  );
};

export default FilterQueries;
