import React from 'react';
import { Provider } from 'react-redux';
import {
  render as rtlRender,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import configureStore from 'redux-mock-store';

import FilterDashboards from './FilterDashboards';

const render = (storeState: any = {}, overProps: any = {}) => {
  const mockStore = configureStore([]);
  const state = {
    dashboards: {
      tagsPool: [],
      tagsFilters: {
        showOnlyPublicDashboards: false,
        tags: [],
      },
    },
    ...storeState,
  };

  const store = mockStore({ ...state });

  const props = {
    ...overProps,
  };

  const wrapper = rtlRender(
    <Provider store={store}>
      <FilterDashboards {...overProps} />
    </Provider>
  );

  return {
    store,
    props,
    wrapper,
  };
};

test('allows user to filter dashboards based on public criteria', async () => {
  const {
    wrapper: { getByText },
    store,
  } = render();

  const element = getByText('tags_filters.title');
  fireEvent.click(element);

  await waitFor(() => {
    store.clearActions();
    const publicFilter = getByText('tags_filters.show_only_public_dashboards');
    fireEvent.click(publicFilter);

    expect(store.getActions()).toMatchInlineSnapshot(`
      Array [
        Object {
          "payload": Object {
            "filterPublic": true,
          },
          "type": "@dashboard/SET_TAGS_FILTERS_PUBLIC",
        },
      ]
    `);
  });
});

test('allows user to filter dashboards based on selected tags', async () => {
  const {
    wrapper: { getByText },
    store,
  } = render({
    dashboards: {
      tagsPool: ['marketing', 'it'],
      tagsFilters: {
        showOnlyPublicDashboards: false,
        tags: [],
      },
    },
  });

  const element = getByText('tags_filters.title');
  fireEvent.click(element);

  await waitFor(() => {
    store.clearActions();
    const tagElement = getByText('marketing');
    fireEvent.click(tagElement);

    expect(store.getActions()).toMatchInlineSnapshot(`
      Array [
        Object {
          "payload": Object {
            "tags": Array [
              "marketing",
            ],
          },
          "type": "@dashboard/SET_TAGS_FILTERS",
        },
      ]
    `);
  });
});

test('allows user to clear filters', async () => {
  const {
    wrapper: { getByText },
    store,
  } = render();

  const element = getByText('tags_filters.title');
  fireEvent.click(element);

  await waitFor(() => {
    store.clearActions();
    const element = getByText('tags_filters.clear');
    fireEvent.click(element);

    expect(store.getActions()).toMatchInlineSnapshot(`
      Array [
        Object {
          "payload": Object {
            "filterPublic": false,
          },
          "type": "@dashboard/SET_TAGS_FILTERS_PUBLIC",
        },
        Object {
          "payload": Object {
            "tags": Array [],
          },
          "type": "@dashboard/SET_TAGS_FILTERS",
        },
      ]
    `);
  });
});

test('renders the number of active filters', async () => {
  const {
    wrapper: { getByText },
  } = render({
    dashboards: {
      tagsPool: ['marketing', 'it'],
      tagsFilters: {
        showOnlyPublicDashboards: true,
        tags: ['sales'],
      },
    },
  });

  expect(getByText('tags_filters.title (2)')).toBeInTheDocument();
});
