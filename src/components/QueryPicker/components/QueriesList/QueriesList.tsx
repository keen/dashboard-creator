import React, { FC } from 'react';

import QueryItem from '../QueryItem';

import { SavedQuery } from '../../../../modules/queries';

type Props = {
  /** Collection of saved queries */
  queries: SavedQuery[];
  /** Select query event handler */
  onSelectQuery: (query: SavedQuery) => void;
};

const QueriesList: FC<Props> = ({ queries, onSelectQuery }) => {
  return (
    <>
      {queries.map((query) => {
        const { id, displayName, visualization } = query;

        return (
          <QueryItem
            key={id}
            name={displayName}
            visualization={visualization}
            onClick={() => onSelectQuery(query)}
          />
        );
      })}
    </>
  );
};

export default QueriesList;
