import React, { FC, useContext, useState, useMemo, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Loader } from '@keen.io/ui-core';

import {
  LoaderContainer,
  QueriesContainer,
  EmptySearch,
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
      .catch((err) => {
        console.error(err);
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

  const isEmptySearch = searchPhrase && filteredQueries.length === 0;

  return (
    <div>
      {isLoadingQueries && (
        <LoaderContainer>
          <Loader width={50} height={50} />
        </LoaderContainer>
      )}
      {isLoaded && (
        <>
          <SearchInput
            placeholder={t('query_picker.search_query_placeholder')}
            searchPhrase={searchPhrase}
            onChangePhrase={(phrase) => setSearchPhrase(phrase)}
            onClearSearch={() => setSearchPhrase('')}
          />
          {isEmptySearch ? (
            <EmptySearch>{t('query_picker.empty_search_results')}</EmptySearch>
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
    </div>
  );
};

export default QueryPicker;
