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

test('allows user to delete dashbord', () => {
  const {
    wrapper: { getByText },
    store,
  } = render();

  const deleteLink = getByText('actions_menu.delete_dashboard');
  fireEvent.click(deleteLink);

  expect(store.getActions()).toMatchInlineSnapshot(`
    Array [
      Object {
        "payload": Object {
          "dashboardId": "@dashboard/id",
        },
        "type": "@dashboards/DELETE_DASHBOARD",
      },
    ]
  `);
});

test('allows user to clone dashbord', () => {
  const {
    wrapper: { getByText },
    store,
  } = render();

  const cloneLink = getByText('actions_menu.clone_dashboard');
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

test('allows user to edit dashbord', () => {
  const {
    wrapper: { getByText },
    store,
  } = render();

  const cloneLink = getByText('actions_menu.edit_dashboard');
  fireEvent.click(cloneLink);

  expect(store.getActions()).toMatchInlineSnapshot(`
    Array [
      Object {
        "payload": Object {
          "dashboardId": "@dashboard/id",
        },
        "type": "@dashboards/EDIT_DASHBOARD",
      },
    ]
  `);
});

test('allows user to share dashbord', () => {
  const {
    wrapper: { getByText },
    store,
  } = render();

  const shareLink = getByText('actions_menu.share_dashboard');
  fireEvent.click(shareLink);

  expect(store.getActions()).toMatchInlineSnapshot(`
    Array [
      Object {
        "payload": Object {
          "dashboardId": "@dashboard/id",
        },
        "type": "@dashboards/SHOW_DASHBOARD_SHARE_MODAL",
      },
    ]
  `);
});
