import React, {
  FC,
  useContext,
  useState,
  useMemo,
  useEffect,
  createContext,
  useRef,
} from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';
import { Alert, Button, Loader } from '@keen.io/ui-core';

import {
  LoaderContainer,
  QueriesContainer,
  CreateNewQuery,
  NewQueryButton,
  AlertContainer,
  Message,
  Description,
  FiltersContainer,
  SearchContainer,
} from './QueryPicker.styles';

import SearchInput from '../SearchInput';
import { QueriesList, FilterQueries } from './components';
import {
  createQuery,
  selectSavedQuery,
  serializeSavedQuery,
  SavedQuery,
  SavedQueryAPIResponse,
} from '../../modules/queries';

import { createSavedQueryTagsPool } from '../../utils';

import { APIContext } from '../../contexts';

export const QueryPickerContext = createContext({ modalContentRef: null });

const QueryPicker: FC = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const modalContentRef = useRef(null);

  const [error, setError] = useState(null);
  const [isLoaded, setLoaded] = useState(false);
  const [isLoadingQueries, setQueriesLoading] = useState(null);

  const [searchPhrase, setSearchPhrase] = useState('');
  const [savedQueries, setSavedQueries] = useState<SavedQuery[]>([]);
  const [tagsPool, setTagsPool] = useState([]);
  const [tagsFilters, setTagsFilter] = useState([]);
  const [onlyCachedQueries, setOnlyCachedQueries] = useState(false);

  const [inViewRefTop, inViewTop] = useInView();
  const [inViewRefBottom, inViewBottom] = useInView();

  const { keenAnalysis } = useContext(APIContext);

  useEffect(() => {
    const fetchQueries = keenAnalysis
      .get(keenAnalysis.url('queries', 'saved'))
      .auth(keenAnalysis.masterKey())
      .send();

    setQueriesLoading(true);

    fetchQueries
      .then((queries: SavedQueryAPIResponse[]) =>
        setSavedQueries(queries.map(serializeSavedQuery))
      )
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoaded(true);
        setQueriesLoading(false);
      });
  }, []);

  const filteredQueries = useMemo(() => {
    let queriesList = savedQueries;
    if (savedQueries.length > 0) {
      setTagsPool(createSavedQueryTagsPool(savedQueries));

      if (tagsFilters.length > 0) {
        queriesList = queriesList.filter(({ tags }) =>
          tags?.some((tag) => tagsFilters.includes(tag))
        );
      }

      if (onlyCachedQueries) {
        queriesList = queriesList.filter(({ cached }) => cached);
      }
    }

    if (searchPhrase) {
      const phrase = searchPhrase.toLowerCase();
      queriesList = queriesList.filter(({ displayName }) =>
        displayName.toLowerCase().includes(phrase)
      );
    }

    return queriesList;
  }, [searchPhrase, savedQueries, tagsFilters, onlyCachedQueries]);

  const isEmptyList = isLoaded && filteredQueries.length === 0;
  const isEmptySearch = searchPhrase && filteredQueries.length === 0;

  return (
    <QueryPickerContext.Provider value={{ modalContentRef }}>
      <div>
        <CreateNewQuery>
          <NewQueryButton>
            <Button variant="success" onClick={() => dispatch(createQuery())}>
              {t('query_picker.new_query_button')}
            </Button>
          </NewQueryButton>
          <Description>{t('query_picker.new_query_description')}</Description>
        </CreateNewQuery>
        <div>
          {isLoadingQueries && (
            <LoaderContainer>
              <Loader width={50} height={50} />
            </LoaderContainer>
          )}
          {error && (
            <AlertContainer>
              <Alert type="error">
                {t('query_picker.saved_queries_error')}
              </Alert>
            </AlertContainer>
          )}
          {isLoaded && !error && (
            <>
              <FiltersContainer>
                <SearchContainer>
                  <SearchInput
                    placeholder={t('query_picker.search_query_placeholder')}
                    searchPhrase={searchPhrase}
                    onChangePhrase={(phrase) => setSearchPhrase(phrase)}
                    onClearSearch={() => setSearchPhrase('')}
                  />
                </SearchContainer>
                <FilterQueries
                  tagsPool={tagsPool}
                  tagsFilters={tagsFilters}
                  showOnlyCachedQueries={onlyCachedQueries}
                  onUpdateCacheFilter={(isActive: boolean) => {
                    setOnlyCachedQueries(isActive);
                  }}
                  onUpdateTagsFilters={(tags: string[]) => {
                    setTagsFilter(tags);
                  }}
                  onClearFilters={() => {
                    setTagsFilter([]);
                    setOnlyCachedQueries(false);
                  }}
                />
              </FiltersContainer>
              {isEmptySearch ? (
                <Message>{t('query_picker.empty_search_results')}</Message>
              ) : (
                <>
                  {isEmptyList ? (
                    <Message>{t('query_picker.empty_project')}</Message>
                  ) : (
                    <QueriesContainer
                      ref={modalContentRef}
                      overflowTop={!inViewTop}
                      overflowBottom={!inViewBottom}
                    >
                      <div ref={inViewRefTop}></div>
                      <QueriesList
                        queries={filteredQueries}
                        onSelectQuery={(query) =>
                          dispatch(selectSavedQuery(query))
                        }
                      />
                      <div ref={inViewRefBottom}></div>
                    </QueriesContainer>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </QueryPickerContext.Provider>
  );
};

export default QueryPicker;
