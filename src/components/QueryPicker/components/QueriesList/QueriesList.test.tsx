import React from 'react';
import { render as rtlRender, fireEvent } from '@testing-library/react';

import QueriesList from './QueriesList';

import { savedQueries } from '../../../../modules/queries/fixtures';

const render = (overProps: any = {}) => {
  const props = {
    queries: savedQueries,
    onSelectQuery: jest.fn(),
    ...overProps,
  };

  const wrapper = rtlRender(<QueriesList {...props} />);

  return {
    props,
    wrapper,
  };
};

test('calls "onSelectQuery" event handler', () => {
  const {
    wrapper: { getByText },
    props: { queries, onSelectQuery },
  } = render();

  const [firstQuery] = queries;
  const { displayName } = firstQuery;

  const queryElement = getByText(displayName);
  fireEvent.click(queryElement);

  expect(onSelectQuery).toHaveBeenCalledWith(firstQuery);
});
