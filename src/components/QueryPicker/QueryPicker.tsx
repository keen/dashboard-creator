import React, { FC, useContext, useState, useMemo, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Loader, Alert } from '@keen.io/ui-core';

import {
  LoaderContainer,
  QueriesContainer,
  Message,
} from './QueryPicker.styles';

import SearchInput from '../SearchInput';
import { QueriesList } from './components';
import {
  selectSavedQuery,
  serializeSavedQuery,
  SavedQuery,
  SavedQueryAPIResponse,
} from '../../modules/queries';

import { APIContext } from '../../contexts';

const QueryPicker: FC<{}> = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [error, setError] = useState(null);
  const [isLoaded, setLoaded] = useState(false);
  const [isLoadingQueries, setQueriesLoading] = useState(null);

  const [searchPhrase, setSearchPhrase] = useState('');
  const [savedQueries, setSavedQueries] = useState<SavedQuery[]>([]);

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

    if (searchPhrase) {
      const phrase = searchPhrase.toLowerCase();
      queriesList = queriesList.filter(({ displayName }) =>
        displayName.toLowerCase().includes(phrase)
      );
    }

    return queriesList;
  }, [searchPhrase, savedQueries]);

  const isEmptyList = isLoaded && filteredQueries.length === 0;
  const isEmptySearch = searchPhrase && filteredQueries.length === 0;

  return (
    <div>
      {isLoadingQueries && (
        <LoaderContainer>
          <Loader width={50} height={50} />
        </LoaderContainer>
      )}
      {error && (
        <Alert type="error">{t('query_picker.saved_queries_error')}</Alert>
      )}
      {isLoaded && !error && (
        <>
          <SearchInput
            placeholder={t('query_picker.search_query_placeholder')}
            searchPhrase={searchPhrase}
            onChangePhrase={(phrase) => setSearchPhrase(phrase)}
            onClearSearch={() => setSearchPhrase('')}
          />
          {isEmptySearch ? (
            <Message>{t('query_picker.empty_search_results')}</Message>
          ) : (
            <>
              {isEmptyList ? (
                <Message>{t('query_picker.empty_project')}</Message>
              ) : (
                <QueriesContainer>
                  <QueriesList
                    queries={filteredQueries}
                    onSelectQuery={(query) => dispatch(selectSavedQuery(query))}
                  />
                </QueriesContainer>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default QueryPicker;
