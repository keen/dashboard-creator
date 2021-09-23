import React from 'react';
import { render as rtlRender, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { mockAllIsIntersecting } from 'react-intersection-observer/test-utils';

import ConfirmQueryChange from './ConfirmQueryChange';
import { AppContext } from '../../contexts';

afterEach(() => {
  mockAllIsIntersecting(false);
});

beforeEach(() => {
  mockAllIsIntersecting(true);
});

const render = (
  storeState: any = {},
  overProps: any = {},
  contextValues = {}
) => {
  const props = {
    isOpen: true,
    ...overProps,
  };

  const mockStore = configureStore([]);
  const store = mockStore({
    dashboards: {
      connectedDashboards: {
        isLoading: false,
        isError: false,
        items: [],
      },
    },
    ...storeState,
  });

  const contextValue = {
    features: {
      enableDashboardConnections: false,
    },
    ...contextValues,
  } as any;

  const wrapper = rtlRender(
    <Provider store={store}>
      <AppContext.Provider value={contextValue}>
        <ConfirmQueryChange {...props} />
      </AppContext.Provider>
    </Provider>
  );

  return {
    store,
    props,
    wrapper,
  };
};

jest.useFakeTimers();

test('notifies after mounting component', () => {
  const { store } = render();

  expect(store.getActions()).toMatchInlineSnapshot(`
    Array [
      Object {
        "payload": undefined,
        "type": "chartEditor/queryUpdateConfirmationMounted",
      },
    ]
  `);
});

test('allows user to update saved query', () => {
  const {
    store,
    wrapper: { getByText },
  } = render();

  store.clearActions();

  const button = getByText('confirm_query_change.update_save_query');
  fireEvent.click(button);

  expect(store.getActions()).toMatchInlineSnapshot(`
    Array [
      Object {
        "payload": undefined,
        "type": "chartEditor/confirmSaveQueryUpdate",
      },
    ]
  `);
});

test('allows user to convert saved query to ad-hoc query', () => {
  const {
    store,
    wrapper: { getByText },
  } = render();

  store.clearActions();

  const element = getByText('confirm_query_change.update_ad_hoc_query');
  fireEvent.click(element);

  expect(store.getActions()).toMatchInlineSnapshot(`
    Array [
      Object {
        "payload": undefined,
        "type": "chartEditor/useQueryForWidget",
      },
    ]
  `);
});

test('allows user to close query change confirmation modal', () => {
  const {
    store,
    wrapper: { getByText },
  } = render();

  store.clearActions();

  const cancel = getByText('confirm_query_change.cancel');
  fireEvent.click(cancel);

  expect(store.getActions()).toMatchInlineSnapshot(`
    Array [
      Object {
        "payload": undefined,
        "type": "chartEditor/hideQueryUpdateConfirmation",
      },
    ]
  `);
});

test('informs user that connected dashboards are disabled', () => {
  const {
    wrapper: { getByText },
  } = render();

  const notification = getByText(
    'confirm_query_change.dashboard_connection_disabled'
  );
  expect(notification).toBeInTheDocument();
});

test('informs user that there is an error with dashboards connections', () => {
  const {
    wrapper: { getByText },
  } = render(
    {
      dashboards: {
        connectedDashboards: {
          isLoading: false,
          isError: true,
          items: [],
        },
      },
    },
    {},
    {
      features: {
        enableDashboardConnections: true,
      },
    }
  );

  const notification = getByText(
    'confirm_query_change.dashboard_connection_error'
  );
  expect(notification).toBeInTheDocument();
});

test('informs user that there are no dashboards connections', () => {
  const {
    wrapper: { getByText },
  } = render(
    {
      dashboards: {
        connectedDashboards: {
          isLoading: false,
          isError: false,
          items: [],
        },
      },
    },
    {},
    {
      features: {
        enableDashboardConnections: true,
      },
    }
  );

  const notification = getByText(
    'confirm_query_change.update_no_dashboards_connected'
  );
  expect(notification).toBeInTheDocument();
});

test('shows connected dashboards', () => {
  const connectedDashboards = [
    { id: '@id-1', title: '@title-1' },
    { id: '@id-2', title: '@title-2' },
    { id: '@id-3', title: '@title-3' },
  ];
  const {
    wrapper: { getByText },
  } = render(
    {
      dashboards: {
        connectedDashboards: {
          isLoading: false,
          isError: false,
          items: connectedDashboards,
        },
      },
    },
    {},
    {
      features: {
        enableDashboardConnections: true,
      },
    }
  );

  const notification = getByText(
    'confirm_query_change.update_with_dashboards_connected'
  );
  expect(notification).toBeInTheDocument();

  for (const dashboard of connectedDashboards) {
    expect(getByText(dashboard.title)).toBeInTheDocument();
  }
});
