import React from 'react';
import { render as rtlRender, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import DashboardListOrder from './DashboardListOrder';

const render = () => {
  const mockStore = configureStore([]);
  const store = mockStore({
    dashboards: {
      dashboardListOrder: 'recent',
    },
  });

  const wrapper = rtlRender(
    <Provider store={store}>
      <DashboardListOrder />
    </Provider>
  );

  return {
    store,
    wrapper,
  };
};

test('allows user sort dashboards as A - Z', async () => {
  const {
    store,
    wrapper: { getByText, getByTestId },
  } = render();

  const container = getByTestId('dropable-container');
  fireEvent.click(container);

  const order = getByText('A - Z');
  fireEvent.click(order);

  expect(store.getActions()).toMatchInlineSnapshot(`
    Array [
      Object {
        "payload": Object {
          "order": "az",
        },
        "type": "@dashboards/SET_DASHBOARD_LIST_ORDER",
      },
    ]
  `);
});
