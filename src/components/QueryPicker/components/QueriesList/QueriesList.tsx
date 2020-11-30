import React, { FC } from 'react';
import { Query } from '@keen.io/parser';

import { SavedQuery } from '../../../../modules/queries';

type Props = {
  /** Collection of saved queries */
  queries: SavedQuery[];
  /** Select query event handler */
  onSelectQuery: (id: string, query: Query) => void;
};

const QueriesList: FC<Props> = ({ queries, onSelectQuery }) => {
  return (
    <div>
      {queries.map(({ id, settings }) => (
        <div key={id} onClick={() => onSelectQuery(id, settings)}>
          {id}
        </div>
      ))}
    </div>
  );
};

export default QueriesList;
