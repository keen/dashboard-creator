import React from 'react';
import { Provider } from 'react-redux';
import { render as rtlRender, fireEvent } from '@testing-library/react';
import configureStore from 'redux-mock-store';

import ActionsMenu from './ActionsMenu';

const render = (overProps: any = {}) => {
  const props = {
    dashboardId: '@dashboard/id',
    onClose: jest.fn(),
    ...overProps,
  };

  const mockStore = configureStore([]);
  const store = mockStore({});

  const wrapper = rtlRender(
    <Provider store={store}>
      <ActionsMenu {...props} />
    </Provider>
  );

  return {
    props,
    store,
    wrapper,
  };
};

test('allows user to clone dashbord', () => {
  const {
    wrapper: { getByText },
    store,
  } = render();

  const cloneLink = getByText('viewer.clone_dashboard');
  fireEvent.click(cloneLink);

  expect(store.getActions()).toMatchInlineSnapshot(`
    Array [
      Object {
        "payload": Object {
          "dashboardId": "@dashboard/id",
        },
        "type": "@dashboards/CLONE_DASHBOARD",
      },
    ]
  `);
});
