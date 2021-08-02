import React from 'react';
import {
  render as rtlRender,
  waitFor,
  fireEvent,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import QueryPicker from './QueryPicker';

import { DashboardAPI } from '../../api';

import { SELECT_SAVED_QUERY } from '../../modules/queries';
import { savedQueriesResponse } from '../../modules/queries/fixtures';
import { APIContext } from '../../contexts';

const render = (overProps: any = {}, keenAnalysisInstance: any = {}) => {
  const props = {
    ...overProps,
  };

  const mockStore = configureStore([]);
  const store = mockStore({});

  const keenAnalysis = {
    get: jest.fn().mockReturnThis(),
    auth: jest.fn().mockReturnThis(),
    url: jest.fn(),
    masterKey: jest.fn(),
    send: jest.fn().mockResolvedValue([]),
    ...keenAnalysisInstance,
  };

  const wrapper = rtlRender(
    <APIContext.Provider
      value={{ keenAnalysis, dashboardApi: {} as DashboardAPI }}
    >
      <Provider store={store}>
        <QueryPicker {...props} />
      </Provider>
    </APIContext.Provider>
  );

  return {
    store,
    props,
    wrapper,
  };
};

test('renders list of saved queries', async () => {
  const keenAnalysis = {
    send: jest.fn().mockResolvedValue(savedQueriesResponse),
  };

  const {
    wrapper: { getAllByTestId },
  } = render({}, keenAnalysis);

  await waitFor(() =>
    expect(getAllByTestId('query-item').length).toEqual(
      savedQueriesResponse.length
    )
  );
});

test('allows user to select saved query', async () => {
  const keenAnalysis = {
    send: jest.fn().mockResolvedValue(savedQueriesResponse),
  };

  const {
    store,
    wrapper: { getByText },
  } = render({}, keenAnalysis);

  await waitFor(() => {
    const element = getByText('Query 01');
    fireEvent.click(element);

    expect(store.getActions()).toEqual([
      expect.objectContaining({
        type: SELECT_SAVED_QUERY,
      }),
    ]);
  });
});

test('allows user to create new query', async () => {
  const keenAnalysis = {
    send: jest.fn().mockResolvedValue(savedQueriesResponse),
  };

  const {
    store,
    wrapper: { getByText },
  } = render({}, keenAnalysis);

  await waitFor(() => getByText('Query 01'));

  const button = getByText('query_picker.new_query_button');
  fireEvent.click(button);

  expect(store.getActions()).toMatchInlineSnapshot(`
    Array [
      Object {
        "payload": undefined,
        "type": "@queries/CREATE_QUERY",
      },
    ]
  `);
});

test('allows user to search for specific saved query', async () => {
  const keenAnalysis = {
    send: jest.fn().mockResolvedValue(savedQueriesResponse),
  };

  const {
    wrapper: { container, getByText, queryByText },
  } = render({}, keenAnalysis);

  await waitFor(() => expect(getByText('Query 01')).toBeInTheDocument());

  const input = container.querySelector('input');
  fireEvent.change(input, { target: { value: 'Query 02' } });

  expect(queryByText('Query 01')).not.toBeInTheDocument();
  expect(getByText('Query 02')).toBeInTheDocument();
});

test('renders message about empty project', async () => {
  const {
    wrapper: { getByText },
  } = render();

  await waitFor(() =>
    expect(getByText('query_picker.empty_project')).toBeInTheDocument()
  );
});

test('renders error message about problems with fetching saved queries', async () => {
  const keenAnalysis = {
    send: jest.fn().mockRejectedValue({}),
  };

  const {
    wrapper: { getByText },
  } = render({}, keenAnalysis);

  await waitFor(() =>
    expect(getByText('query_picker.saved_queries_error')).toBeInTheDocument()
  );
});
