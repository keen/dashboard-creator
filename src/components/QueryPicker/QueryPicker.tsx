import React, { FC, useContext, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { QueriesList } from './components';
import { selectSavedQuery, serializeSavedQuery } from '../../modules/queries';

import { APIContext } from '../../contexts';

const QueryPicker: FC<{}> = () => {
  const dispatch = useDispatch();
  const [isLoaded, setLoaded] = useState(false);
  const [isLoadingQueries, setQueriesLoading] = useState(null);

  const [savedQueries, setSavedQueries] = useState([]);

  const { keenAnalysis } = useContext(APIContext);

  useEffect(() => {
    const fetchQueries = keenAnalysis
      .get(keenAnalysis.url('queries', 'saved'))
      .auth(keenAnalysis.masterKey())
      .send();

    setQueriesLoading(true);

    fetchQueries
      .then((queries) => setSavedQueries(queries.map(serializeSavedQuery)))
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoaded(true));
  }, []);

  return (
    <div>
      {isLoadingQueries && <div>Loading...</div>}
      {isLoaded && (
        <QueriesList
          queries={savedQueries}
          onSelectQuery={(queryName, query) =>
            dispatch(selectSavedQuery(queryName, query))
          }
        />
      )}
    </div>
  );
};

export default QueryPicker;
